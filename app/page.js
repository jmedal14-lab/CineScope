import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import PopularMovies from "../components/PopularMovies";
import SearchForm from "../components/SearchForm";
import s from "../components/CineScope.module.css";
export default function Home() {
  return (
    <>
      <section
        className={`container ${s.home}`}
        aria-label="Find your next film"
      >
        <div>
          <h1>Find your next great film.</h1>
          <p className={s.lead}>
            Find your next watch with <span className="eyebrow">CineScope</span>
          </p>
          <SearchForm />
        </div>
        <div className={s.homeArtwork}>
          <Image
            src="/illustrations/home-cinema.svg"
            width={600}
            height={450}
            alt=""
            priority
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </section>
      <section
        className={`container ${s.homePopular}`}
        aria-labelledby="popular-heading"
      >
        <div className={s.popularHeading}>
          <h2 id="popular-heading">Popular movies</h2>
          <Link href="/catalog">View all movies →</Link>
        </div>
        <Suspense fallback={<p role="status">Loading popular movies…</p>}>
          <PopularMovies />
        </Suspense>
      </section>
    </>
  );
}
