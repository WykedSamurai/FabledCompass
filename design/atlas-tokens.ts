export const atlasColors = {
  background: "#040814",
  backgroundSoft: "#07111f",
  surface: "#101d2c",
  panel: "rgba(18, 32, 52, .48)",
  panelDeep: "rgba(8, 18, 32, .34)",
  border: "rgba(45, 212, 243, .2)",
  borderStrong: "rgba(45, 212, 243, .36)",
  accent: "#2dd4f3",
  accentHover: "#5ee6ff",
  text: "#f3f4f6",
  muted: "#94a3b8",
  dim: "#64748b",
  star: "#ffffff",
  nebula: "#8b5cf6",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444"
} as const;

export const atlasSpacing = {
  xs: ".35rem",
  sm: ".65rem",
  md: "1rem",
  lg: "1.25rem",
  xl: "2rem",
  xxl: "3rem"
} as const;

export const atlasRadii = {
  sm: "10px",
  md: "16px",
  lg: "20px",
  round: "999px"
} as const;

export const atlasShadows = {
  glass: "0 22px 65px rgba(0, 0, 0, .24), inset 0 1px 0 rgba(255, 255, 255, .035)",
  glow: "0 0 28px rgba(45, 212, 243, .18)",
  lifted: "0 24px 70px rgba(0, 0, 0, .28), 0 0 0 1px rgba(45, 212, 243, .06)"
} as const;

export const atlasMotion = {
  fast: "160ms ease",
  medium: "220ms ease",
  slow: "520ms ease",
  twinkle: "5.5s ease-in-out infinite"
} as const;

export const atlasZIndex = {
  sky: 0,
  shell: 1,
  scrim: 18,
  drawer: 19,
  floating: 20,
  modal: 30
} as const;
