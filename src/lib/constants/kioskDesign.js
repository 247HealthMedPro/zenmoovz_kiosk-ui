/** Design tokens — kiosk-first (1920×1080), tablet & mobile */

export const BRAND_PRIMARY = "#16304a";

export const KIOSK_VIEWPORT = { width: 1920, height: 1080 };

export const BREAKPOINTS = {
  mobileMax: 767,
  tabletMin: 768,
  tabletMax: 1024,
  kioskMin: 1025,
};

export const TOUCH_MIN_PX = 48;
export const TOUCH_COMFORT_PX = 56;
export const TOUCH_LARGE_PX = 64;

/** Content max widths */
export const LAYOUT = {
  shell: "90rem",
  wizard: "56rem",
  form: "40rem",
  narrow: "28rem",
};

export const SPACING = {
  section: "2rem",
  sectionKiosk: "2.5rem",
  card: "1.5rem",
  cardKiosk: "2rem",
};
