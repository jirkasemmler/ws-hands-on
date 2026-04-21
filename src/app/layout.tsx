import type { Metadata } from "next";
import NavBar from "./NavBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Workshop Dashboard",
  description: "Přehled účastníků workshopu v reálném čase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <NavBar />
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
