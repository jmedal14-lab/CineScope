import Artwork from "./Artwork";
import s from "./CineScope.module.css";
function CastCards({ cast }) {
  return (
    <div className={s.cast}>
      {cast.map((actor, i) => (
        <article key={`${actor.id}-${i}`}>
          <Artwork path={actor.portrait} title={actor.name} portrait />
          <h3>{actor.name}</h3>
          <p className="muted">{actor.character || "Role not listed"}</p>
        </article>
      ))}
    </div>
  );
}
export default function CastSection({ cast }) {
  return (
    <section className="section" aria-labelledby="cast-heading">
      <h2 id="cast-heading">Cast</h2>
      {cast.length ? (
        <>
          <CastCards cast={cast.slice(0, 12)} />
          {cast.length > 12 && (
            <details>
              <summary>Show all cast ({cast.length})</summary>
              <CastCards cast={cast.slice(12)} />
            </details>
          )}
        </>
      ) : (
        <p className="muted">Cast information is unavailable.</p>
      )}
    </section>
  );
}
