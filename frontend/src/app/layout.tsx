import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBubble from "@/components/ChatBubble";
import { Web3Provider } from "@/lib/web3";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maiat | The Reputation Clearing Network",
  description: "NFT Skill Marketplace + Mutual Reviews + Dynamic Fees for Agent Economy on XLayer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-white" style={{ backgroundColor: '#0A0A0A' }}>
        <Web3Provider>
          <div className="atmosphere" />
          <div className="mesh-grid fixed inset-0 z-[-1] pointer-events-none" />
          <Navbar />
          <main className="flex-1 pt-16 relative z-10">
            {children}
          </main>
          <Footer />
          <ChatBubble />
        </Web3Provider>
      </body>
    </html>
  );
}
