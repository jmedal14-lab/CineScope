import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container section">
      <h1>Movie or page not found</h1>
      <p>That address may be unavailable. Find another film in the catalog.</p>
      <Link className="button" href="/catalog">
        Explore catalog
      </Link>
    </div>
  );
}
