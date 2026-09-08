"use client";
import { useId } from "react";
import s from "./CineScope.module.css";
export default function SearchForm({ q = "" }) {
  const id = useId();
  return (
    <form
      action="/search"
      method="get"
      className={s.search}
      onSubmit={(e) => {
        const input = e.currentTarget.elements.q;
        input.value = input.value.trim();
        if (!input.value) {
          e.preventDefault();
          input.setCustomValidity("Enter a movie title or keyword.");
          input.reportValidity();
        }
      }}
    >
      <label htmlFor={id}>Search by title or keyword</label>
      <div className={s.searchRow}>
        <input
          id={id}
          name="q"
          defaultValue={q}
          required
          maxLength={150}
          placeholder="Try a title or space travel"
          onInput={(e) => e.target.setCustomValidity("")}
        />
        <button type="submit">Search</button>
      </div>
    </form>
  );
}
