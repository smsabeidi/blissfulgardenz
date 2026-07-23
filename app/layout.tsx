import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Instrument_Sans, Newsreader } from "next/font/google";
import { brand } from "@/content/site";
import "./globals.css";

// Golden Hour type system (reference-driven: Solare / Saol Display at
// casadisolare.com and unseen.co). Bodoni Moda is the closest open face to
// that monumental high-contrast serif (variable weight + optical size + true
// italics); Instrument Sans stands in for Neue Montreal as the quiet
// grotesque. Variables keep their historic names so tokens and components
// pick the swap up without edits.
const display = Bodoni_Moda({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  // Serve the optical-size axis: at wordmark scale the didone gets the
  // high-contrast display cut instead of the text cut.
  axes: ["opsz"],
  display: "swap",
});

const sans = Instrument_Sans({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

const longform = Newsreader({
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
      // Next 16 no longer overrides scroll-behavior:smooth during navigation
      // unless asked; without this, every route change smooth-scrolls to top.
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${longform.variable} h-full`}
    >
      <body className="grain flex min-h-full flex-col">
        {/* Reveal styles are SSR'd inline (opacity 0, masks, clips) and lifted
            by the motion runtime. Without JS nothing would ever lift them, so
            no-JS visitors get everything visible, unanimated. */}
        <noscript>
          <style>{`main *{opacity:1 !important;transform:none !important;filter:none !important;clip-path:none !important;}`}</style>
        </noscript>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        {children}
      </body>
    </html>
  );
}
