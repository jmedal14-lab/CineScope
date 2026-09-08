import ResultsPage from "../../components/ResultsPage";
export const metadata = { title: "Search movies" };
export default async function Search({ searchParams }) {
  return <ResultsPage params={await searchParams} />;
}
