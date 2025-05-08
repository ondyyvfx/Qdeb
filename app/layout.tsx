import type { Metadata } from "next";
import "./styles/globals.css";
import { Montserrat } from "next/font/google";
import { AppWrapper } from "@/components/shared/AppWrapper";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "QDeb",
  description: "Qazaq Debate Community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable}`}>
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
