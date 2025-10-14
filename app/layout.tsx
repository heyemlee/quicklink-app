import "./globals.css";
import AuthProvider from "./providers/SessionProvider";
import { ReactNode } from "react";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "KABi Design",
  description:
    "Help us grow by sharing your thoughts and following us on social media",
  icons: {
    icon: "/icons/company_logo.png",
    apple: "/icons/company_logo.png",
    shortcut: "/icons/company_logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#7c3aed" />
      </head>
      <body>
        <AuthProvider session={null}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

