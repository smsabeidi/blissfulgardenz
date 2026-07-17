import type { Metadata, Viewport } from "next";
import { Fraunces, Inter_Tight, Source_Serif_4 } from "next/font/google";
import { brand } from "@/content/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  // Final production domain pending client DNS decision (PRD §21).
  metadataBase: new URL("https://blissfulgardenz.com"),
  title: {
    default: `${brand.name} · ${brand.motto.replace(/\.$/, "")}`,
    template: `%s · ${brand.name}`,
  },
  description: brand.description,
  openGraph: {
    siteName: brand.name,
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F4EC" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1512" },
  ],
};

// Pre-paint theme resolution: manual choice beats system preference (DESIGN.md
// palette precedence). Runs as the first thing in <body> so dusk visitors never
// see an ivory flash. localStorage is wrapped: private-mode Safari falls back
// to system preference for the session.
const themeBootstrap = `(function(){var t="dawn";try{var s=localStorage.getItem("bg-theme");if(s==="dusk"||s==="dawn"){t=s}else if(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches){t="dusk"}}catch(e){try{if(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches){t="dusk"}}catch(e2){}}document.documentElement.setAttribute("data-theme",t)})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dawn"
      suppressHydrationWarning
      className={`${fraunces.variable} ${interTight.variable} ${sourceSerif.variable} h-full`}
    >
      <body className="grain flex min-h-full flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        {children}
      </body>
    </html>
  );
}
