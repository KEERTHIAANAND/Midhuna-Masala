import type { Metadata } from "next";
import { Inter, Crimson_Text, Kavivanar, Arima, Baloo_Thambi_2, Noto_Serif_Tamil, Catamaran } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import DevToolsBlocker from "@/components/common/DevToolsBlocker";
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

const kavivanar = Kavivanar({
  variable: "--font-kavivanar",
  subsets: ["tamil"],
  weight: "400",
  display: "swap",
});

const arima = Arima({
  variable: "--font-arima",
  subsets: ["tamil"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const balooThambi = Baloo_Thambi_2({
  variable: "--font-baloo",
  subsets: ["tamil"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const notoSerifTamil = Noto_Serif_Tamil({
  variable: "--font-noto-tamil",
  subsets: ["tamil"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const catamaran = Catamaran({
  variable: "--font-catamaran",
  subsets: ["tamil"],
  weight: ["400", "600", "700", "800", "900"],
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
        className={`${inter.variable} ${crimsonText.variable} ${kavivanar.variable} ${arima.variable} ${balooThambi.variable} ${notoSerifTamil.variable} ${catamaran.variable} antialiased`}
        suppressHydrationWarning
      >
        <DevToolsBlocker />
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
