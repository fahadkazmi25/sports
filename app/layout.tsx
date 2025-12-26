import type { Metadata } from "next";
import { Outfit, Tourney } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { cn } from "@/lib/utils";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const tourney = Tourney({ subsets: ["latin"], variable: "--font-tourney" });

export const metadata: Metadata = {
  title: {
    default: "ApexSports | Premium Cinematic Match Experience",
    template: "%s | ApexSports"
  },
  description: "Experience matches like never before with 3D depth, premium motion design, and real-time match intelligence. Your elite sports universe.",
  keywords: ["sports", "matches", "live scores", "leagues", "football", "soccer", "cinematic sports"],
  authors: [{ name: "ApexSports Agency" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    // url: "https://apexsports.com/",
    title: "ApexSports | Premier Match Discovery",
    description: "The future of sports motion design and match data visualization.",
    siteName: "ApexSports",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApexSports | Premium Sports Universe",
    description: "Real-time data meets premium cinematic design.",
  },
  icons: {
    icon: "/sport-football.svg",
    shortcut: "/sport-football.svg",
    apple: "/sport-football.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-outfit antialiased selection:bg-primary/30",
          outfit.variable,
          tourney.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Suspense fallback={null}>
              <Navbar />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
