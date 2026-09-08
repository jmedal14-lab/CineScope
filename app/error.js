"use client";
export default function ErrorPage({ reset }) {
  return (
    <div role="alert" className="container section">
      <h1>Something interrupted the screening</h1>
      <p>We couldn’t load this page. Please try again.</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
