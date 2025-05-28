import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Education+ | AI-Powered Learning with Crypto Rewards",
  keywords: "AI, education, crypto, rewards, learning, blockchain, study tools",
  authors: [{ name: "Sotonye McLeod Bob-Manuel" }],
  creator: "Sotonye McLeod Bob-Manuel,Mbiatke Mkanta, Chibuzor Ubaneche, ",
  publisher: "Education+",
  description: "Revolutionize your learning with AI-powered tools and earn crypto rewards for achieving your academic goals.",
  openGraph: {
    title: "Education+ | AI-Powered Learning with Crypto Rewards",
    description: "Revolutionize your learning with AI-powered tools and earn crypto rewards for achieving your academic goals.",
    url: "https://education-plus.com",
    siteName: "Education+",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
