import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BloomFi Perp Intel | Market Intelligence Dashboard",
  description: "Deep analytics on the perpetual DEX landscape. Market share, volumes, fees, open interest, and competitive intelligence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#08080d] text-gray-200 min-h-screen`}>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-60 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

