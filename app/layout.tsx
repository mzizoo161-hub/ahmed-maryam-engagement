import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Montserrat,
} from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ahmed & Maryam | Engagement Invitation",
  description:
    "You are warmly invited to celebrate the engagement of Ahmed and Maryam on 8 August 2026.",
  applicationName: "Ahmed & Maryam Engagement",
  openGraph: {
    title: "Ahmed & Maryam | Engagement Invitation",
    description:
      "Join us on 8 August 2026 at 8:00 PM at Latoya Hall.",
    type: "website",
    images: [
      {
        url: "/images/invitation.JPG",
        width: 1051,
        height: 1479,
        alt: "Ahmed and Maryam engagement invitation",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}