"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import s from "./CineScope.module.css";
export function Camera() {
  return (
    <svg className={s.camera} viewBox="0 0 32 24" aria-hidden="true">
      <rect x="1" y="3" width="20" height="18" rx="4" fill="currentColor" />
      <path d="M23 8 31 3v18l-8-5z" fill="currentColor" />
    </svg>
  );
}
export default function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const menu = useRef(null);
  return (
    <header className={`container ${s.header}`}>
      <Link className={s.logo} href="/">
        <Camera />
        CineScope
      </Link>
      <button
        className={s.menu}
        ref={menu}
        aria-expanded={open}
        aria-controls="navigation"
        onClick={() => setOpen(!open)}
      >
        Menu
      </button>
      <nav
        id="navigation"
        aria-label="Main navigation"
        className={s.nav}
        data-open={open}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            menu.current.focus();
          }
        }}
      >
        <Link
          href="/"
          aria-current={path === "/" ? "page" : undefined}
          onClick={() => setOpen(false)}
        >
          Home
        </Link>
        <Link
          href="/catalog"
          aria-current={path === "/catalog" ? "page" : undefined}
          onClick={() => setOpen(false)}
        >
          Catalog
        </Link>
        <button
          aria-label="Toggle light or dark theme"
          onClick={() => {
            const theme =
              document.documentElement.dataset.theme === "dark"
                ? "light"
                : "dark";
            document.documentElement.dataset.theme = theme;
            try {
              localStorage.setItem("cinescope-theme", theme);
            } catch {}
          }}
        >
          ◐ Theme
        </button>
      </nav>
    </header>
  );
}
