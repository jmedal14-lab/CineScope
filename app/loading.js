import s from "../components/CineScope.module.css";
export default function Loading() {
  return (
    <div className="container section" role="status">
      <p>Loading movies…</p>
      <div className={s.grid}>
        {Array.from({ length: 5 }, (_, i) => (
          <div aria-hidden="true" className={s.skeleton} key={i} />
        ))}
      </div>
    </div>
  );
}
