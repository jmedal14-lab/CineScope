"use client";
import { useRef, useState, useEffect } from "react";
import s from "./CineScope.module.css";
export default function TrailerModal({ video, title, demo = false }) {
  const dialog = useRef(null);
  const trigger = useRef(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current.showModal();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  function close() {
    dialog.current.close();
    setOpen(false);
    trigger.current?.focus();
  }
  if (!video) return <p>Trailer unavailable.</p>;
  const youtube = video.site === "YouTube";
  const watch = youtube
    ? `https://www.youtube.com/watch?v=${video.key}`
    : `https://vimeo.com/${video.key}`;
  return (
    <>
      <button ref={trigger} onClick={() => setOpen(true)}>
        {demo ? "Watch sample video" : "Watch Trailer"}
      </button>
      {open && (
        <dialog
          ref={dialog}
          className={s.dialog}
          aria-labelledby="trailer-title"
          onCancel={(e) => {
            e.preventDefault();
            close();
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              const r = e.currentTarget.getBoundingClientRect();
              if (
                e.clientX < r.left ||
                e.clientX > r.right ||
                e.clientY < r.top ||
                e.clientY > r.bottom
              )
                close();
            }
          }}
        >
          <div className={s.dialogHeader}>
            <h2 id="trailer-title">
              {demo ? "Sample video" : `${title} — trailer`}
            </h2>
            <button autoFocus onClick={close} aria-label="Close trailer">
              Close
            </button>
          </div>
          <iframe
            className={s.player}
            src={
              youtube
                ? `https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1&controls=1`
                : `https://player.vimeo.com/video/${video.key}?autoplay=1`
            }
            title={demo ? video.name : `${title} trailer`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
          <p>
            {demo
              ? "Demo playback uses Big Buck Bunny, not a trailer for this fictional film. "
              : ""}
            If playback is blocked, use the player’s play control or{" "}
            <a href={watch} target="_blank" rel="noreferrer">
              watch on {video.site}
            </a>
            .
          </p>
        </dialog>
      )}
    </>
  );
}
