import "./globals.css";

export const metadata = {
  title: "Share Your Experience - Review & Follow",
  description:
    "Help us grow by sharing your thoughts and following us on social media",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
