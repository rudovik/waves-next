import { Oswald, Monoton } from "next/font/google"

export const monoton = Monoton({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  preload: false,
  style: "normal",
  adjustFontFallback: false,
})

export const oswald = Oswald({
  weight: ["300", "400", "500"],
  subsets: ["latin", "cyrillic"],
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  style: "normal",
})
