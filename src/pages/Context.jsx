import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const BASE_API = "https://yts.mx/api/v2/list_movies.json";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [totalPosts, setTotalPosts] = useState(0);
  const [moviesData, setMoviesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(12);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [query, setQuery] = useState("");

  const getMoviesData = async (url) => {
    setIsLoading(true);
    try {
      const response = await axios.get(url);
      setMoviesData(response.data.data.movies || []);
      setTotalPosts(response.data.data.movie_count);
      console.log(response.data.data.movies);
      setErrorMsg(null);
    } catch (error) {
      console.error("Fetch error:", error);
      setErrorMsg("Failed to fetch movies");
      setMoviesData([]);
      setTotalPosts(0);
    }
    setIsLoading(false);
  };

  const lastItemIndex = currentPage * postsPerPage;
  const firstItemIndex = lastItemIndex - postsPerPage;
  const thisPageItems = moviesData.slice(firstItemIndex, lastItemIndex);

  console.log("these are the posts per page", thisPageItems);
  useEffect(() => {
    const baseUrl = `${BASE_API}?limit=${postsPerPage}&page=${currentPage}`;

    const queryParam = query.length > 2 ? `&query_term=${query}` : "";
    const genreParam = selectedGenre ? `&genre=${selectedGenre}` : "";

    const fullUrl = `${baseUrl}${queryParam}${genreParam}`;

    getMoviesData(fullUrl);
  }, [query, currentPage, selectedGenre]);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        errorMsg,
        setQuery,
        query,
        totalPosts,
        setSelectedGenre,
        postsPerPage,
        moviesData,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => useContext(AppContext);

export { AppProvider, useGlobalContext };
