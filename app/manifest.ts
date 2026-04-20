import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Green Blanket",
    short_name: "GreenBlanket",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2e7d32",
    icons: [
      {
        src: "/images/GreenBlanket_logo_sized_192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/GreenBlanket_logo_sized_512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}