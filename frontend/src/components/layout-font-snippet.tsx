// app/layout.tsx  (add the font; keep the rest of your layout)
import { Nunito } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-nunito",
});

// <html lang="en" className={nunito.variable}>
