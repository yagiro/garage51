import type { Metadata } from "next";
// import localFont from "next/font/local";
import { Sixtyfour, Poppins } from 'next/font/google'
import "./globals.css";
import './lib/firestore'

const sixtyfour = Sixtyfour({
  subsets: ['latin'],
  variable: '--font-sixtyfour',
  display: 'swap',
})

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

const fonts = [
  sixtyfour,
  poppins,
]

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "Garage51",
  description: "Fun stuff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVariablesConcat = fonts.map(font => font.variable).join(' ')
  return (
    <html className="" lang="en">
      <body
        className={`${fontVariablesConcat} antialiased main-font bg-gray-50 text-gray-600`}
      >
        {children}
      </body>
    </html>
  );
}
