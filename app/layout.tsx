import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

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
    url: "https://apexsports.com/",
    title: "ApexSports | Premier Match Discovery",
    description: "The future of sports motion design and match data visualization.",
    siteName: "ApexSports",
  },
  twitter: {
    card: "summary_large_image",
    title: "ApexSports | Premium Sports Universe",
    description: "Real-time data meets premium cinematic design.",
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
          "min-h-screen font-sans antialiased selection:bg-primary/30",
          outfit.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t py-12 glass relative z-50">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 gradient-sports rounded-lg shadow-lg" />
                    <span className="text-sm font-black uppercase tracking-tighter italic">Apex<span className="text-primary">Sports</span></span>
                  </div>
                  <p className="text-muted-foreground text-[10px] font-black tracking-[0.4em] uppercase">
                    &copy; {new Date().getFullYear()} Cinematic Match Intelligence. All rights Reserved.
                  </p>
                  <div className="flex gap-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 cursor-not-allowed">Privacy</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 cursor-not-allowed">Terms</span>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
