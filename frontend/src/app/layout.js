import "./globals.css";

// Temporarily disable Google Fonts to avoid build errors in CI environment
const geistSans = {
  variable: "--font-geist-sans",
};

const geistMono = {
  variable: "--font-geist-mono",
};

export const metadata = {
  title: "Finear | AI-Powered Learning with Crypto Rewards",
  keywords: "AI, education, crypto, rewards, learning, blockchain, study tools",
  authors: [{ name: "Sotonye McLeod Bob-Manuel" }],
  creator: "Sotonye McLeod Bob-Manuel,Mbiatke Mkanta, Chibuzor Ubaneche, ",
  publisher: "Finear",
  description: "Revolutionize your learning with AI-powered tools and earn crypto rewards for achieving your academic goals.",
  openGraph: {
    title: "Finear | AI-Powered Learning with Crypto Rewards",
    description: "Revolutionize your learning with AI-powered tools and earn crypto rewards for achieving your academic goals.",
    url: "https://finear.app",
    siteName: "Finear",
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
