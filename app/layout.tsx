import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const serif = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Living Word — A Reader's Companion to the Kitáb-i-Íqán",
  description:
    "A guided, reverent, text-centered companion to Bahá'u'lláh's Kitáb-i-Íqán — tracing its argument, its Qur'anic evidence, and its interpretive moves.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="ui sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:bg-paper-warm focus:px-3 focus:py-1 focus:text-sm"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="pb-24">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className="ui border-b border-rule/80 bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-baseline justify-between px-6 py-5">
        <Link
          href="/"
          className="font-serif text-lg tracking-wide text-ink hover:text-accent-deep"
        >
          The Living Word
        </Link>
        <nav className="flex items-center gap-6 text-sm text-ink-muted">
          <Link href="/read" className="hover:text-accent-deep">
            Read
          </Link>
          <Link href="/map" className="hover:text-accent-deep">
            Argument Map
          </Link>
          <Link href="/onboarding/bahai" className="hover:text-accent-deep">
            Paths
          </Link>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="ui border-t border-rule/80">
      <div className="mx-auto max-w-5xl px-6 py-10 text-xs leading-relaxed text-ink-faint">
        <p>
          Kitáb-i-Íqán text: translation by Shoghi Effendi (public domain).
          Qur'an translation: A. Yusuf Ali (public domain). This is a study
          companion; it is not a substitute for the original text, nor for the
          authoritative literature of the Bahá'í Faith.
        </p>
      </div>
    </footer>
  );
}
