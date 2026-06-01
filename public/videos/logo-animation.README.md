# Logo animation (WebM) — full-screen loop on `/kiosk`

Place your file at **`public/videos/logo-animation.webm`**.

The landing page plays it **edge-to-edge** (muted, looped). The **Start Experience** button stays hidden until the user touches, clicks, or presses a key anywhere on the screen.

```env
NEXT_PUBLIC_LOGO_VIDEO_SRC=/videos/logo-animation.webm
```

Optional static fallback if video fails: `NEXT_PUBLIC_LOGO_SRC`
