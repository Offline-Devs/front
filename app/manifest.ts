import type { MetadataRoute } from "next";
import { env } from "@/config/env";
export default function manifest(): MetadataRoute.Manifest { return { name: env.appName, short_name: env.appShortName, description: env.appDescription, start_url: "/", display: "standalone", background_color: "#f7faf8", theme_color: "#1f7a61", lang: "fa", dir: "rtl" }; }
