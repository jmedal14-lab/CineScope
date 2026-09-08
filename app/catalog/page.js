import ResultsPage from "../../components/ResultsPage";
export const metadata = { title: "Popular films" };
export default async function Catalog({ searchParams }) {
  return <ResultsPage params={await searchParams} catalog />;
}
