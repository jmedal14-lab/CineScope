import Image from "next/image";
export const metadata = { title: "About & credits" };
export default function About() {
  return (
    <div className="container section">
      <h1>About CineScope</h1>
      <p>
        A movie discovery project by Jeanice Medal. Find your next great film.
      </p>
      <h2>Credits</h2>
      <p>
        <a href="https://www.themoviedb.org/">
          <Image
            src="/tmdb-logo.svg"
            alt="The Movie Database (TMDB)"
            width={123}
            height={16}
          />
        </a>
      </p>
      <p>
        Home-cinema illustration by <a href="https://undraw.co/">unDraw</a>,
        used under the <a href="https://undraw.co/license">unDraw license</a>.
        Inter is licensed under the SIL Open Font License.
      </p>
      <p>
        Movie data and artwork in live mode are provided by{" "}
        <a href="https://www.themoviedb.org/">TMDb</a>.
      </p>
      <p>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
      <p>
        Demo records are fictional. The sample video is{" "}
        <a href="https://peach.blender.org/">Big Buck Bunny</a>, © Blender
        Foundation, under{" "}
        <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>.
      </p>
    </div>
  );
}
