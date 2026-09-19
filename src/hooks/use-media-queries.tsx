import { useMediaQuery } from "react-responsive";

// 1. Mobile-First Standard Breakpoints (min-width matching Tailwind classes)
export const useSm = () => useMediaQuery({ query: "(min-width: 640px)" }); // sm:
export const useMd = () => useMediaQuery({ query: "(min-width: 768px)" }); // md:
export const useLg = () => useMediaQuery({ query: "(min-width: 1024px)" }); // lg:
export const useXl = () => useMediaQuery({ query: "(min-width: 1280px)" }); // xl:
export const use2Xl = () => useMediaQuery({ query: "(min-width: 1536px)" }); // 2xl:

// 2. Exact Range Hooks (Isolated screens to match tailwind max-xx equivalents)
export const useIsOnlyMobile = () =>
  useMediaQuery({ query: "(max-width: 639px)" });

export const useIsOnlySm = () =>
  useMediaQuery({ query: "(min-width: 640px) and (max-width: 767px)" });

export const useIsOnlyMd = () =>
  useMediaQuery({ query: "(min-width: 768px) and (max-width: 1023px)" });

export const useIsOnlyLg = () =>
  useMediaQuery({ query: "(min-width: 1024px) and (max-width: 1279px)" });

export const useIsOnlyXl = () =>
  useMediaQuery({ query: "(min-width: 1280px) and (max-width: 1535px)" });

// 3. Below Utility Hooks (Equivalent to Tailwind max-* variants)
export const useMaxSm = () => useMediaQuery({ query: "(max-width: 639px)" }); // max-sm:
export const useMaxMd = () => useMediaQuery({ query: "(max-width: 767px)" }); // max-md:
export const useMaxLg = () => useMediaQuery({ query: "(max-width: 1023px)" }); // max-lg:
export const useMaxXl = () => useMediaQuery({ query: "(max-width: 1279px)" }); // max-xl:
export const useMax2Xl = () => useMediaQuery({ query: "(max-width: 1535px)" }); // max-2xl:
