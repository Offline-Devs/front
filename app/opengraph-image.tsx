import { readFile } from "node:fs/promises";
import path from "node:path";
import { env } from "@/config/env";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = env.appDescription;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const vazirmatn = readFile(path.join(process.cwd(), "public", "fonts", "vazirmatn-bold.ttf"));
const logo = readFile(path.join(process.cwd(), "public", "icons", "icon-192.png"));

export default async function OpenGraphImage() {
  const logoDataUrl = `data:image/png;base64,${(await logo).toString("base64")}`;
  return new ImageResponse(
    <div
      dir="rtl"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 80,
        background: "#f3faf7",
        color: "#153f34",
        fontFamily: "Vazirmatn",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logoDataUrl} width={100} height={100} alt="" style={{ objectFit: "contain" }} />
      <div style={{ fontSize: 28, color: "#1f7a61", marginBottom: 24 }}>سامانه آزمون و مشاوره</div>
      <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.4 }}>{env.appName}</div>
      <div style={{ fontSize: 30, marginTop: 24, color: "#55736b" }}>{env.appDescription}</div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Vazirmatn",
          data: await vazirmatn,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
