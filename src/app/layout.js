import { Outfit, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--next-font-sora",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--next-font-outfit",
  display: "swap",
});

const BRAND = "#16304A";

export const metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_BRAND_NAME || "ZenMoovz",
    template: `%s · ${process.env.NEXT_PUBLIC_BRAND_NAME || "ZenMoovz"}`,
  },
  description: "Premium sports kit kiosk — cricket and badminton recommendations",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: process.env.NEXT_PUBLIC_BRAND_NAME || "ZenMoovz",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: BRAND,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="font-outfit min-h-dvh flex flex-col bg-surface text-text-primary">
        {children}
      </body>
    </html>
  );
}
