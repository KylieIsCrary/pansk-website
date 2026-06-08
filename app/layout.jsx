import { Anton, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export const metadata = {
  title: "PANSK Since 2023",
  description:
    "A desktop-first personal streetwear brand showcase for PANSK, built with scroll narrative, product visuals, and reserved media slots.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${anton.variable} ${inter.variable} ${instrumentSerif.variable}`}>
        {children}
      </body>
    </html>
  );
}
