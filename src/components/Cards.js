import React, { useEffect, useState, useCallback } from "react";
import ReactStars from "react-stars";
import { ProgressBar } from "react-loader-spinner";
import { getDocs } from "firebase/firestore";
import { moviesRef } from "./firebase/firebase";
import MovieDetails from "./MovieDetails";
import Slider from "react-slick";
import debounce from "lodash.debounce";

const Cards = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchInput, setSearchInput] = useState(""); // Immediate input value
  const [filterName, setFilterName] = useState(""); // Filtered value
  const [filterRating, setFilterRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const _data = await getDocs(moviesRef);
      const movies = _data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setData(movies);
      setLoading(false);
    }
    getData();
  }, []);

  // Debounce function to update filterName
  const debouncedFilterUpdate = useCallback(
    debounce((value) => setFilterName(value), 500),
    []
  );

  // Update filterName using debounced function
  useEffect(() => {
    debouncedFilterUpdate(searchInput);
    return () => debouncedFilterUpdate.cancel();
  }, [searchInput, debouncedFilterUpdate]);

  // Slider settings
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  const filteredMovies = data.filter((movie) => {
    const averageRating = calculateAverageRating(movie.reviews);
    return (
      movie.title.toLowerCase().includes(filterName.toLowerCase()) &&
      averageRating >= filterRating
    );
  });

  const indexOfLastMovie = currentPage * itemsPerPage;
  const indexOfFirstMovie = indexOfLastMovie - itemsPerPage;
  const currentMovies = filteredMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);

  return (
    <div className="w-full px-3 mt-3">
      {/* Filters */}
      <div className="flex items-center justify-between w-full gap-3 mb-4 text-white">
        <input
          type="text"
          placeholder="Search"
          className="w-1/3 px-4 py-2 text-white rounded-lg bg-slate-700"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <select
          className="w-1/3 px-4 py-2 text-white rounded-lg bg-slate-700"
          value={filterRating}
          onChange={(e) => setFilterRating(Number(e.target.value))}
        >
          <option value={0}>Filter</option>
          <option value={1}>1+</option>
          <option value={2}>2+</option>
          <option value={3}>3+</option>
          <option value={4}>4+</option>
          <option value={5}>5</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center w-full min-h-screen">
          <ProgressBar height={200} color="white" />
        </div>
      ) : (
        <>
          {/* Continuous Movie Slider */}
          <div className="mb-4 ">
            <Slider {...sliderSettings}>
              {data.map((movie, index) => {
                const averageRating = calculateAverageRating(movie.reviews);
                return (
                  <div key={index} className="flex justify-center p-4">
                    <div className="w-full p-4 text-white bg-black border-2 border-gray-600 rounded-lg shadow-lg">
                      <img
                        className="w-full h-48 mb-4 border-2 border-gray-700 rounded-md"
                        alt="Movie Poster"
                        src={movie.image}
                        onClick={() => setSelectedMovie(movie)}
                      />
                      <h1 className="mb-2 text-xl font-bold">{movie.title}</h1>
                      <h1 className="text-gray-400">
                        <span className="mr-1">Rating:</span>
                        <ReactStars
                          size={20}
                          half={true}
                          value={averageRating}
                          edit={false}
                        />
                      </h1>
                      <h1 className="text-gray-400">
                        <span>Year:</span> {movie.year}
                      </h1>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>

          {/* Movie Cards */}
          <div className="flex flex-wrap justify-between">
            {currentMovies.map((movie, index) => {
              const averageRating = calculateAverageRating(movie.reviews);
              return (
                <div
                  key={index}
                  className="flex items-center justify-center w-full p-4 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4"
                >
                  <div className="w-full p-4 text-white bg-black border-4 border-gray-600 rounded-lg shadow-lg hover:scale-105">
                    <img
                      className="w-full h-48 mb-4 border-2 border-gray-700 rounded-md md:h-56 hover:scale-105"
                      alt="Movie Poster"
                      src={movie.image}
                      onClick={() => setSelectedMovie(movie)}
                    />
                    <h1 className="mb-2 text-xl font-bold">{movie.title}</h1>
                    <h1 className="text-gray-400">
                      <span className="mr-1">Rating:</span>
                      <ReactStars
                        size={20}
                        half={true}
                        value={averageRating}
                        edit={false}
                      />
                    </h1>
                    <h1 className="text-gray-400">
                      <span>Year:</span> {movie.year}
                    </h1>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 text-white bg-gray-700 rounded-md"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 text-white">{currentPage}</span>
        <button
          className="px-4 py-2 text-white bg-gray-700 rounded-md"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* MovieDetails */}
      {selectedMovie && (
        <MovieDetails
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
          movie={selectedMovie}
        />
      )}
    </div>
  );
};

export default Cards;
