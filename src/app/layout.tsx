import Navbar from "@/components/Navbar/Navbar";
import { QueryProvider } from "@/components/providers/QueryProviders";
import "@/styles/globals.css";
import { type Metadata } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  title: "Pokédex",
  description: "A Pokédex app using Next.js and t3 stack",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <Navbar />

        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
