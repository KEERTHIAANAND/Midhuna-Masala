import type { Metadata } from "next";
import { Inter, Crimson_Text } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import LenisProvider from "@/components/providers/LenisProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const crimsonText = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Midhuna Masala - Traditional Stone Ground Spices",
  description: "Hand-pounded, sun-dried, stone ground masalas from the heart of Chettinad. Pure, authentic spices crafted with love — from our village to your kitchen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${crimsonText.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <CartProvider>
            <LenisProvider>
              <Navbar />
              {children}
            </LenisProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
