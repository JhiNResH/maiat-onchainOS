import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBubble from "@/components/ChatBubble";
import { Web3Provider } from "@/lib/web3";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
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
      className={`${inter.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col overflow-x-hidden font-sans" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
        <ThemeProvider>
          <Web3Provider>
            <div className="atmosphere-blob-1" />
            <div className="atmosphere-blob-2" />
            <Navbar />
            <main className="flex-1 pt-24 relative z-10">
              {children}
            </main>
            <Footer />
            <ChatBubble />
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
