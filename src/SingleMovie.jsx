import { useParams } from "react-router-dom";
import { useGlobalContext } from "./pages/Context";

function SingleMovie() {
  const { moviesData } = useGlobalContext();
  console.log("MOvies data are here", moviesData);
  const { id } = useParams();

  const movie = moviesData.find((movie) => movie.imdb_code === id);
  console.log(movie);
  if (!movie) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex justify-center items-center">
        <h2 className="text-2xl font-semibold">Movie not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8 flex flex-col md:flex-row justify-center items-center gap-10">
      <div className="flex-shrink-0">
        <img
          src={movie.medium_cover_image}
          alt={movie.title}
          className="w-[300px] rounded-xl shadow-lg mx-auto"
        />
      </div>

      <div className="max-w-lg space-y-4 text-left">
        <h2 className="mt-4 text-3xl font-bold text-center text-amber-300">
          {movie.title}
        </h2>

        <p className="text-lg">
          <span className="font-semibold text-yellow-400">Year:</span>
          {movie.year}
        </p>
        <p className="text-lg">
          <span className="font-semibold text-yellow-400">Rating:</span>
          {movie.rating}
        </p>
        <p className="text-lg">
          <span className="font-semibold text-yellow-400">Runtime:</span>
          {movie.runtime} minutes
        </p>
        <p className="text-lg">
          <span className="font-semibold text-yellow-400">Summary:</span>
          {movie.summary}
        </p>
      </div>
    </div>
  );
}

export default SingleMovie;
