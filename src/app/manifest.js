const BRAND = "#16304A";

export default function manifest() {
  return {
    name: process.env.NEXT_PUBLIC_BRAND_NAME || "ZenMoovz Kiosk",
    short_name: "Kiosk",
    description: "Premium cricket and badminton kit recommendations",
    start_url: "/kiosk",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: BRAND,
    theme_color: BRAND,
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
