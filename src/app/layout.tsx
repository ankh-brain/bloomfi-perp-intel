import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BloomFi Perp Intel | Market Intelligence Dashboard",
  description: "Deep analytics on the perpetual DEX landscape.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="app">
          <Sidebar />
          <div className="content">{children}</div>
        </div>
      </body>
    </html>
  );
}

