"use client";

import s from "./CineScope.module.css";

export default function SortSelect({ state, catalog }) {
  return (
    <form
      action={catalog ? "/catalog" : "/search"}
      method="get"
      className={s.resultsSort}
    >
      {!catalog && <input type="hidden" name="q" value={state.q} />}
      <input type="hidden" name="page" value={state.page} />
      <div className={s.sort}>
        <label htmlFor="sort">Sort</label>
        <select
          id="sort"
          name="sort"
          defaultValue={state.sort}
          aria-describedby="sort-scope"
          onChange={(event) => event.currentTarget.form.requestSubmit()}
        >
          <option value="relevance">{catalog ? "Popular" : "Relevance"}</option>
          <option value="az">A–Z</option>
          <option value="newest">Newest</option>
          <option value="rating">Rating</option>
        </select>
      </div>
    </form>
  );
}
