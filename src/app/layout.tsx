import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Travel Spoken - AI Travel Assistant",
  description: "Discover your next adventure with AI-powered travel planning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <header className="w-full bg-white shadow-sm border-b flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center group">
            <Image
              src="/images/Travel-spoken-logo.png"
              alt="TravelSpoken Logo"
              width={180}
              height={40}
              className="transition-transform group-hover:scale-105 object-contain"
              priority
            />
          </Link>
          <nav>
            <Link href="/faq" className="text-base font-medium text-gray-700 hover:text-blue-600 transition ml-6">FAQ</Link>
            <Link href="/trips" className="text-base font-medium text-gray-700 hover:text-blue-600 transition ml-6">Trips</Link>
            <Link href="/about-us" className="text-base font-medium text-gray-700 hover:text-blue-600 transition ml-6">About Us</Link>
            <Link href="/chat" className="text-base font-medium text-gray-700 hover:text-blue-600 transition ml-6">Chat</Link>
            <Link href="/login" className="text-base font-medium text-gray-700 hover:text-blue-600 transition ml-6">Login</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
