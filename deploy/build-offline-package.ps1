$ErrorActionPreference = "Stop"

$DeployDir = $PSScriptRoot
$ProjectRoot = Split-Path -Parent $DeployDir
$EnvPath = Join-Path $DeployDir ".env"
$ImagesDir = Join-Path $DeployDir "images"
$ImageTar = Join-Path $ImagesDir "ayandesabz-images.tar"

if (-not (Test-Path $EnvPath)) {
    throw "Missing env file: $EnvPath"
}

$envMap = @{}
Get-Content $EnvPath | ForEach-Object {
    $line = $_.Trim()
    if ($line -eq "" -or $line.StartsWith("#")) { return }
    $idx = $line.IndexOf("=")
    if ($idx -lt 1) { return }
    $key = $line.Substring(0, $idx)
    $value = $line.Substring($idx + 1)
    $envMap[$key] = $value
}

New-Item -ItemType Directory -Force $ImagesDir | Out-Null

$backendImage = "ayandesabz-backend:offline"
$webImage = "ayandesabz-web:offline"
$runtimeImages = @("postgres:16-alpine", "redis:7-alpine", "caddy:2.8-alpine")

Write-Host "Building backend image..."
docker build -t $backendImage (Join-Path $ProjectRoot "backend\backend")

Write-Host "Building web image..."
$publicKeys = @(
    "NEXT_PUBLIC_APP_NAME",
    "NEXT_PUBLIC_APP_SHORT_NAME",
    "NEXT_PUBLIC_APP_DESCRIPTION",
    "NEXT_PUBLIC_APP_VERSION",
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_API_BASE_PATH",
    "NEXT_PUBLIC_LOCALE",
    "NEXT_PUBLIC_TIME_ZONE",
    "NEXT_PUBLIC_SUPPORT_EMAIL",
    "NEXT_PUBLIC_SUPPORT_PHONE",
    "NEXT_PUBLIC_INSTAGRAM_URL",
    "NEXT_PUBLIC_TELEGRAM_URL",
    "NEXT_PUBLIC_QUERY_STALE_TIME_MS",
    "NEXT_PUBLIC_QUERY_GC_TIME_MS",
    "NEXT_PUBLIC_QUERY_RETRY_COUNT",
    "NEXT_PUBLIC_QUERY_REFETCH_ON_WINDOW_FOCUS",
    "NEXT_PUBLIC_OTP_RESEND_SECONDS",
    "NEXT_PUBLIC_DEFAULT_PAGE_SIZE",
    "NEXT_PUBLIC_PROFILE_UPLOAD_MAX_MB",
    "NEXT_PUBLIC_DOCUMENT_UPLOAD_MAX_MB",
    "NEXT_PUBLIC_MULTIPLE_UPLOAD_MAX_FILES",
    "NEXT_PUBLIC_ENABLE_BLOG",
    "NEXT_PUBLIC_ENABLE_CONTACT_PAGE"
)

$buildArgs = @("build", "-t", $webImage)
foreach ($key in $publicKeys) {
    if ($envMap.ContainsKey($key)) {
        $buildArgs += "--build-arg"
        $buildArgs += "$key=$($envMap[$key])"
    }
}
$buildArgs += (Join-Path $ProjectRoot "front")
docker @buildArgs

foreach ($image in $runtimeImages) {
    Write-Host "Pulling $image..."
    docker pull $image
}

if (Test-Path $ImageTar) {
    Remove-Item -Force $ImageTar
}

Write-Host "Saving offline image bundle to $ImageTar..."
docker save -o $ImageTar $backendImage $webImage @runtimeImages

Write-Host "Done."
docker images $backendImage $webImage
Get-Item $ImageTar | Select-Object FullName, Length
