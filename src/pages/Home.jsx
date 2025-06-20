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
      className="min-h-screen p-16 justify-center"
    >
      <div className="flex items-center space-x-2 relative mt-4 px-4 justify-around">
        <form onSubmit={handleSearch} className="flex space-x-2 items-center">
          <input
            type="search"
            value={searchText}
            placeholder="Search..."
            className="p-3 border-2 border-gray-800 rounded-3xl w-64 bg-transparent text-white"
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
        <div>
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
        </div>

        <div className="flex items-center justify-center h-full gap-11">
          <h1
            className={
              !toggle ? "text-white text-2xl" : "text-gray-500 text-2xl"
            }
          >
            Movies
          </h1>
          <button
            onClick={() => setToggle(!toggle)}
            className={`w-[50px] h-[28px] rounded-full relative cursor-pointer transition-colors duration-200 shadow-[1px_1px_10px_rgba(0,0,0,0.75)] ${
              toggle ? "bg-[#b7b9ba]" : "bg-gray-600"
            }`}
          >
            <div
              className={`w-[20px] h-[20px] bg-white rounded-full absolute top-1/2 left-[3px] transform transition-transform duration-200 ${
                toggle
                  ? "translate-x-[22px] -translate-y-1/2"
                  : "-translate-y-1/2"
              }`}
            ></div>
          </button>
          <h1
            className={
              toggle ? "text-white text-2xl" : "text-gray-500 text-2xl"
            }
          >
            Favourites
          </h1>
        </div>
      </div>

      <div className="flex mt-16 text-gray-400 gap-10">
        {!toggle ? (
          <div className="w-fit">
            <h1 className="text-2xl mb-4 text-white">Movies</h1>
            {isLoading && <p>Loading...</p>}
            {errorMsg && <p>{errorMsg}</p>}

            <div className="flex flex-wrap gap-4">
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
                    <div className="w-56">
                      <NavLink to={`movie/${imdb_code}`} key={imdb_code}>
                        <div
                          key={id}
                          className="block overflow-hidden rounded-xl"
                        >
                          <img
                            src={medium_cover_image}
                            alt={title}
                            className="w-full h-80 object-cover hover:scale-105"
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

                        <div key={id} className="w-full">
                          <NavLink to={`movie/${imdb_code}`} key={imdb_code}>
                            <h2 className="text-lg mt-2 hover:text-yellow-400">
                              {movieName.length > 10
                                ? `${movieName}...`
                                : movieName}
                            </h2>
                          </NavLink>
                          <div className="flex justify-between mt-2">
                            <p className=" text-gray-500">{year}</p>
                            <div className="flex gap-1">
                              <FontAwesomeIcon
                                icon={faStar}
                                className="text-yellow-200"
                              />
                              <p className=" text-gray-500">{rating}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          <div className="w-fit">
            <h1 className="text-2xl mb-4 text-white">Favourites</h1>
            {favourites.length === 0 ? (
              <p className="text-gray-500">No favourites yet</p>
            ) : (
              favourites.map((fav) => (
                <div key={fav.id} className="text-white flex mb-5 gap-4">
                  <img
                    src={fav.medium_cover_image}
                    className="h-20"
                    alt={fav.title}
                  />
                  <div className="w-32">
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
          </div>
        )}
      </div>
      {toggle ? (
        ""
      ) : (
        <div className="text-white text-center p-10 flex justify-center gap-3 ">
          <button
            className="bg-amber-300 text-gray-600  w-20 h-10 rounded-2xl cursor-pointer"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={setCurrentPage === 1}
          >
            previous
          </button>
          <p className="pt-2">{currentPage}</p>
          <button
            className="bg-amber-300 text-gray-600 w-20 h-10 rounded-2xl cursor-pointer"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPosts))
            }
            disabled={setCurrentPage === totalPosts}
          >
            next
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
