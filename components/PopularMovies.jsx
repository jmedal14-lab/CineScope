import Link from "next/link";
import { isDemo, listMovies } from "../lib/movies";
import MovieGrid from "./MovieGrid";

export default async function PopularMovies() {
  let collection;
  try {
    collection = await listMovies({ q: "", page: 1, sort: "relevance" }, true);
  } catch {
    return (
      <p>
        Popular movies are temporarily unavailable.{" "}
        <Link href="/catalog">Try the catalog</Link>.
      </p>
    );
  }
  if (!collection.movies.length)
    return <p>No popular movies are available right now.</p>;
  return (
    <>
      {isDemo() && <p className="muted">Fictional demo collection</p>}
      <MovieGrid movies={collection.movies.slice(0, 5)} demo={isDemo()} />
    </>
  );
}
