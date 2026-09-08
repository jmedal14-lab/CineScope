import Link from "next/link";
import Artwork from "./Artwork";
import s from "./CineScope.module.css";
export function Score({ score, demo = false }) {
  return (
    <span className={s.score}>
      {score === null ? (
        "Not rated"
      ) : (
        <>
          <span className={s.star} aria-hidden="true">
            ★{" "}
          </span>
          {demo ? "Demo" : "TMDb"} {score.toFixed(1)}/10
        </>
      )}
    </span>
  );
}
export default function MovieGrid({ movies, back, demo = false }) {
  return (
    <div className={s.grid}>
      {movies.map((movie) => (
        <Link
          key={movie.id}
          className={s.card}
          href={`/movie/${movie.id}${back ? `?from=${encodeURIComponent(back)}` : ""}`}
          aria-label={`${movie.title}, ${movie.year || "year unavailable"}`}
        >
          <Artwork path={movie.poster} title={movie.title} />
          <div className={s.cardBody}>
            <h3>{movie.title}</h3>
            <p className="muted">{movie.year || "Year unavailable"}</p>
            <Score score={movie.score} demo={demo} />
            <p className={s.summary}>
              {movie.overview ||
                movie.genres.join(" · ") ||
                "Synopsis unavailable."}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
