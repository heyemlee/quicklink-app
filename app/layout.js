import "./globals.css";
import AuthProvider from "./providers/SessionProvider";

export const metadata = {
  title: "KABi Design",
  description:
    "Help us grow by sharing your thoughts and following us on social media",
  icons: {
    icon: "/icons/kabi_favicon.png",
    apple: "/icons/kabi_favicon.png",
    shortcut: "/icons/kabi_favicon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#7c3aed" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
