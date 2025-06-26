import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import React from "react";

const geistSans = Geist({
  variable : "--font-geist-sans",
  subsets : [ "latin" ],
});

const geistMono = Geist_Mono({
  variable : "--font-geist-mono",
  subsets : [ "latin" ],
});

export const metadata : Metadata = {
  title : "Vimflow - Elegant Task Management",
  description : "Elegant task management with vim-style navigation. Organize your thoughts with keyboard efficiency.",
};

export default function RootLayout({
                                     children,
                                   } : Readonly<{
  children : React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressContentEditableWarning>
    <body
      className={ `${ geistSans.variable } ${ geistMono.variable } antialiased` }
    >
    <ThemeProvider>
      { children }
    </ThemeProvider>
    </body>
    </html>
  );
}
