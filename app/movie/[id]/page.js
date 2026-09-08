import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMovie, isDemo } from "../../../lib/movies";
import { safeBack } from "../../../lib/movie-mappers";
import Artwork from "../../../components/Artwork";
import MovieGrid, { Score } from "../../../components/MovieGrid";
import TrailerModal from "../../../components/TrailerModal";
import CastSection from "../../../components/CastSection";
import s from "../../../components/CineScope.module.css";
export async function generateMetadata({ params }) {
  try {
    const movie = await getMovie((await params).id);
    return {
      title: movie?.title || "Movie not found",
      description: movie?.overview,
    };
  } catch {
    return { title: "Movie details" };
  }
}
export default async function Movie({ params, searchParams }) {
  const movie = await getMovie((await params).id);
  if (!movie) notFound();
  const back = safeBack((await searchParams).from);
  const facts = [
    ["Release date", movie.releaseDate],
    ["Runtime", movie.runtime ? `${movie.runtime} minutes` : null],
    ["US certification", movie.certification],
    ["Director", movie.director],
    ["Language", movie.language],
    ["Status", movie.status],
    [
      "Budget",
      movie.budget ? `US$${movie.budget.toLocaleString("en-US")}` : null,
    ],
    [
      "Revenue",
      movie.revenue ? `US$${movie.revenue.toLocaleString("en-US")}` : null,
    ],
    ["Production", movie.production],
  ];
  return (
    <>
      <section className={s.hero}>
        {movie.backdrop && (
          <>
            <Image
              className={s.backdrop}
              src={`https://image.tmdb.org/t/p/w1280${movie.backdrop}`}
              alt=""
              fill
              sizes="100vw"
              priority
            />
            <div className={s.scrim} />
          </>
        )}
        <div className="container">
          <Link href={back}>
            ←{" "}
            {back.startsWith("/search") ? "Back to results" : "Back to catalog"}
          </Link>
          <div className={s.detail}>
            <Artwork path={movie.poster} title={movie.title} priority />
            <div>
              <h1>{movie.title}</h1>
              <p>
                {movie.year || "Release year unavailable"} ·{" "}
                <Score score={movie.score} demo={isDemo()} />
              </p>
              <div className={s.chips}>
                {movie.genres.map((g) => (
                  <span className={s.chip} key={g}>
                    {g}
                  </span>
                ))}
              </div>
              <p className={s.synopsis}>
                {movie.overview || "Synopsis unavailable."}
              </p>
              <dl className={s.facts}>
                {facts
                  .filter(([, value]) => value)
                  .map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
              </dl>
              <TrailerModal
                video={movie.trailer}
                title={movie.title}
                demo={isDemo()}
              />
            </div>
          </div>
        </div>
      </section>
      <div className="container">
        <CastSection cast={movie.cast} />
        <section aria-labelledby="related-heading">
          <h2 id="related-heading">
            {isDemo() ? "More demo films" : "More like this"}
          </h2>
          {movie.recommendations.length ? (
            <MovieGrid
              movies={movie.recommendations}
              demo={isDemo()}
              back={back}
            />
          ) : (
            <p className="muted">No recommendations are available yet.</p>
          )}
        </section>
      </div>
    </>
  );
}
