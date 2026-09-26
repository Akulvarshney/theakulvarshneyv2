import localFont from "next/font/local";
import "./globals.css";
const display = localFont({
  src: "../public/fonts/BarlowCondensed-SemiBold.ttf",
  variable: "--font-display",
  display: "swap",
  weight: "600",
});
export const metadata = {
  title: "Akul Varshney — Software Engineer",
  description:
    "Akul Varshney — product engineering, AI systems, and software for operations at scale. Selected work and an approach to making complex things feel simple.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Akul Varshney — Software Engineer",
    description: "Complex systems. Thoughtfully engineered.",
    type: "website",
  },
};
export const viewport = { themeColor: "#f8f8f5", colorScheme: "light" };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={display.variable}>
      <body>{children}</body>
    </html>
  );
}
