import {
  faMagnifyingGlass,
  faHeart,
  faEllipsisVertical,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGlobalContext } from "./Context";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function Home() {
  const {
    moviesData,
    currentPage,
    selectedGenre,
    isLoading,
    errorMsg,
    setSelectedGenre,
    setQuery,
    query,
    totalPosts,
    postsPerPage,
    setCurrentPage,
  } = useGlobalContext();

  const pages = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pages.push(i);
  }

  const [searchText, setSearchText] = useState(query);
  const [openModel, setOpenModel] = useState(null);
  const [toggle, setToggle] = useState(false);

  const [favourites, setFavourite] = useState(() => {
    const storedFavs = localStorage.getItem("favourites");
    return storedFavs ? JSON.parse(storedFavs) : [];
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim().length > 2) {
      setQuery(searchText.trim());
    }
  };

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  return (
    <div
      style={{ backgroundColor: "#121212" }}
      className="min-h-screen px-4 sm:px-8 lg:px-16 py-10"
    >
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-4">
        <form onSubmit={handleSearch} className="flex space-x-2 items-center">
          <input
            type="search"
            value={searchText}
            placeholder="Search..."
            className="p-3 border-2 border-gray-800 rounded-3xl w-48 sm:w-64 bg-transparent text-white"
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button
            type="submit"
            disabled={searchText.trim().length < 3}
            className={`px-4 py-2 rounded-full transition text-black ${
              searchText.trim().length < 3
                ? "bg-yellow-500 opacity-50 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </form>

        <select
          value={selectedGenre}
          className="p-2 rounded-lg bg-yellow-500 text-black"
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          <option value="action">Action</option>
          <option value="comedy">Comedy</option>
          <option value="drama">Drama</option>
          <option value="horror">Horror</option>
          <option value="romance">Romance</option>
          <option value="sci-fi">Sci-Fi</option>
        </select>

        <div className="flex items-center gap-3">
          <h1
            className={`text-2xl ${!toggle ? "text-white" : "text-gray-500"}`}
          >
            Movies
          </h1>
          <button
            onClick={() => setToggle(!toggle)}
            className={`w-14 h-7 rounded-full relative transition duration-200 shadow ${
              toggle ? "bg-[#b7b9ba]" : "bg-gray-600"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full absolute top-1/2 left-1 transform -translate-y-1/2 transition-transform duration-200 ${
                toggle ? "translate-x-[22px]" : ""
              }`}
            ></div>
          </button>
          <h1 className={`text-2xl ${toggle ? "text-white" : "text-gray-500"}`}>
            Favourites
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col mt-10 text-gray-400">
        {!toggle ? (
          <>
            <h1 className="text-2xl mb-4 text-white">Movies</h1>
            {isLoading && <p>Loading...</p>}
            {errorMsg && <p>{errorMsg}</p>}

            <div className="flex flex-wrap gap-6 justify-center">
              {moviesData?.length > 0 &&
                moviesData.map((movie) => {
                  const {
                    id,
                    medium_cover_image,
                    title,
                    year,
                    rating,
                    imdb_code,
                  } = movie;
                  const movieName = title.substring(0, 20);
                  const isFav = favourites.some((fav) => fav.id === id);

                  return (
                    <div className="w-40 sm:w-44 md:w-56" key={id}>
                      <NavLink to={`movie/${imdb_code}`}>
                        <div className="overflow-hidden rounded-xl">
                          <img
                            src={medium_cover_image}
                            alt={title}
                            className="w-full h-64 sm:h-72 object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      </NavLink>

                      <div className="flex m-2 text-white items-start">
                        <div className="mr-2 cursor-pointer">
                          <FontAwesomeIcon
                            className={isFav ? "text-red-400" : "text-white"}
                            icon={faHeart}
                            onClick={() => {
                              if (!isFav) {
                                setFavourite([...favourites, movie]);
                              } else {
                                setFavourite(
                                  favourites.filter((fav) => fav.id !== id)
                                );
                              }
                            }}
                          />
                        </div>

                        <div className="w-full">
                          <NavLink to={`movie/${imdb_code}`}>
                            <h2 className="text-lg mt-2 hover:text-yellow-400">
                              {movieName.length > 10
                                ? `${movieName}...`
                                : movieName}
                            </h2>
                          </NavLink>
                          <div className="flex justify-between mt-2">
                            <p className="text-gray-500">{year}</p>
                            <div className="flex gap-1">
                              <FontAwesomeIcon
                                icon={faStar}
                                className="text-yellow-200"
                              />
                              <p className="text-gray-500">{rating}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl mb-4 text-white">Favourites</h1>
            {favourites.length === 0 ? (
              <p className="text-gray-500">No favourites yet</p>
            ) : (
              favourites.map((fav) => (
                <div
                  key={fav.id}
                  className="text-white flex mb-5 gap-4 flex-wrap sm:flex-nowrap"
                >
                  <img
                    src={fav.medium_cover_image}
                    className="h-24 w-20 object-cover"
                    alt={fav.title}
                  />
                  <div className="w-full sm:w-32">
                    <h1 className="text-lg">{fav.title}</h1>
                    <p className="text-sm text-gray-400">{fav.year}</p>
                  </div>
                  <div className="relative">
                    <button onClick={() => setOpenModel(fav.id)}>
                      <FontAwesomeIcon
                        icon={faEllipsisVertical}
                        className="cursor-pointer p-3"
                      />
                    </button>

                    {openModel === fav.id && (
                      <div
                        style={{ backgroundColor: "#1c1c1c" }}
                        className="absolute top-8 right-0 z-10 flex flex-col gap-2 p-3 w-44 rounded-xl shadow-lg text-sm"
                      >
                        <p className="text-white">Remove from favourite?</p>
                        <div className="flex justify-end gap-3">
                          <button
                            className="text-gray-300"
                            onClick={() => {
                              setFavourite(
                                favourites.filter((f) => f.id !== fav.id)
                              );
                              setOpenModel(null);
                            }}
                          >
                            Yes
                          </button>
                          <button
                            className="text-gray-500 hover:text-white"
                            onClick={() => setOpenModel(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {!toggle && (
        <div className="text-white text-center p-10 flex flex-wrap justify-center gap-4">
          <button
            className="bg-amber-300 text-gray-600 w-24 h-10 rounded-2xl"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <p className="pt-2">{currentPage}</p>
          <button
            className="bg-amber-300 text-gray-600 w-24 h-10 rounded-2xl"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, pages.length))
            }
            disabled={currentPage === pages.length}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
