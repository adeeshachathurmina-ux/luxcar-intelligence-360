import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { MouseSpotlight } from "@/components/MouseSpotlight";
import { AutomotiveBackdrop } from "@/components/AutomotiveBackdrop";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LuxCar Intelligence 360 | Sri Lanka AI Vehicle Match & Ownership Simulator",
  description: "Advanced dual-horizon vehicle matching platform calibrated for the Sri Lankan automotive market and total cost of ownership simulation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${jetbrainsMono.variable} bg-[#06080e] text-slate-100 antialiased min-h-screen relative font-sans`}
        suppressHydrationWarning
      >
        {/* Interactive Dynamic Mouse Spotlight */}
        <MouseSpotlight />
        {/* Cinematic Video & Canvas Speed Lights Backdrop */}
        <AutomotiveBackdrop />
        <div className="ambient-glow" />
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
