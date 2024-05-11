import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/header/Header";

import {Cabin} from 'next/font/google'

const cabin = Cabin({
  subsets: ['latin'],
  weight: "500"
});

export const metadata: Metadata = {
  title: "Pokedex",
  description: "A simple pokedex app built with Next.js, designed like the generation 9 pokedex.",
};


export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body className={cabin.className}>
        <Header />
        {children}
      </body>
    </html>
  )
}