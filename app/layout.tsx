import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/header/Header";
import Loading from "./components/loader/Loader";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {

  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Loading />
      </body>
    </html>
  )
}