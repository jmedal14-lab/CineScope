import Link from "next/link";
import SearchForm from "./SearchForm";
import SortSelect from "./SortSelect";
import MovieGrid from "./MovieGrid";
import { listMovies, isDemo } from "../lib/movies";
import { searchState, resultsUrl } from "../lib/movie-mappers";
import s from "./CineScope.module.css";
export default async function ResultsPage({ params, catalog = false }) {
  const state = searchState(params);
  let data;
  let failed = false;
  if (catalog || state.q) {
    try {
      data = await listMovies(state, catalog);
    } catch {
      failed = true;
    }
  }
  const url = resultsUrl(state, catalog);
  return (
    <div className={`container ${s.resultsPage}`}>
      <SearchForm key={state.q} q={state.q} />
      <div className={s.toolbar}>
        <div>
          <h1>
            {catalog
              ? "Popular films"
              : state.q
                ? `Results for “${state.q}”`
                : "Find a movie"}
          </h1>
        </div>
        <SortSelect state={state} catalog={catalog} />
      </div>
      {failed ? (
        <div role="alert" className="notice">
          <h2>Movies couldn’t load</h2>
          <p>
            Your search is preserved. The provider may be busy; please try
            again.
          </p>
          <a className="button" href={url}>
            Retry
          </a>
        </div>
      ) : data ? (
        <>
          {data.movies.length ? (
            <MovieGrid movies={data.movies} back={url} demo={isDemo()} />
          ) : (
            <div className="notice">
              <h2>No movies found</h2>
              <p>
                Try another title or a shorter keyword
                {state.page > 1 ? ", or return to the first page" : ""}.
              </p>
              {state.page > 1 && (
                <Link href={resultsUrl({ ...state, page: 1 }, catalog)}>
                  First page
                </Link>
              )}
            </div>
          )}
          <nav className={s.pagination} aria-label="Results pages">
            {state.page > 1 && (
              <Link
                href={resultsUrl({ ...state, page: state.page - 1 }, catalog)}
              >
                ← Previous
              </Link>
            )}
            <span>Page {state.page}</span>
            {data.hasNext && (
              <Link
                href={resultsUrl({ ...state, page: state.page + 1 }, catalog)}
              >
                Next →
              </Link>
            )}
          </nav>
          {!catalog && (
            <p className={`muted ${s.resultsNote}`}>
              <small>{data.note}</small>
            </p>
          )}
        </>
      ) : (
        <p>Enter a movie title or keyword above to get started.</p>
      )}
    </div>
  );
}
