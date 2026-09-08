"use client";
import Image from "next/image";
import { useState } from "react";
import s from "./CineScope.module.css";
export default function Artwork({
  path,
  title,
  portrait = false,
  priority = false,
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={s.art}>
      {path && !failed ? (
        <Image
          src={`https://image.tmdb.org/t/p/w500${path}`}
          alt={portrait ? title : `${title} poster`}
          fill
          sizes="(max-width:639px) 45vw, (max-width:959px) 30vw, 240px"
          priority={priority}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className={s.placeholder}>
          <span aria-hidden="true">{portrait ? "◎" : "▤"}</span>
          {portrait ? "Portrait unavailable" : "Poster unavailable"}
        </span>
      )}
    </div>
  );
}
