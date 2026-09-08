import localFont from "next/font/local";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import { isDemo } from "../lib/movies";
import s from "../components/CineScope.module.css";
import "./globals.css";
const inter = localFont({
  src: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  display: "swap",
});
export const metadata = {
  title: {
    default: "CineScope — Find your next great film",
    template: "%s | CineScope",
  },
  description:
    "Discover movies by title and keyword, explore cast, and watch trailers.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{document.documentElement.dataset.theme=localStorage.getItem('cinescope-theme')==='dark'?'dark':'light'}catch{}",
          }}
        />
      </head>
      <body className={inter.variable}>
        <a className="skip button" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">
          {isDemo() && (
            <div className="container notice">
              Demo preview — fictional films, sample scores, and a sample video.
              Live TMDb data is not configured.
            </div>
          )}
          {children}
        </main>
        <footer className={s.footer}>
          <div className="container">
            <div className={s.footerRow}>
              <strong>CineScope</strong>
              <div className={s.footerLinks}>
                <Link href="/">Home</Link>
                <Link href="/catalog">Catalog</Link>
                <Link href="/about">About & credits</Link>
              </div>
            </div>
            <p>
              Movie data and artwork provided by{" "}
              <a href="https://www.themoviedb.org/">TMDb</a>. This product uses
              the TMDB API but is not endorsed or certified by TMDB.
            </p>
            <p>Copyright © 2026 Jeanice Medal</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
