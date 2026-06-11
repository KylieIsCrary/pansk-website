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
  title: "PANSK 自 2023",
  description:
    "PANSK 国潮男装品牌官网原型，用穿搭叙事、商品视觉与真实上身档案，记录年轻人的日常出发。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className={`${anton.variable} ${inter.variable} ${instrumentSerif.variable}`}>
        {children}
      </body>
    </html>
  );
}
