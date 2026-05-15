import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BloomFi Perp Intel | Market Intelligence Dashboard",
  description: "Deep analytics on the perpetual DEX landscape.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#09090b] text-zinc-300 min-h-screen antialiased`}>
        <Sidebar />
        <main className="lg:pl-56 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

