import React, { useState, useEffect, useMemo } from "react";
import axios from "axios"
import "./MovieItem.css"

const MovieItem = ({ movie }) => {
  const [isOpen, setIsOpen] = useState('Close')
  const apikey = import.meta.env.VITE_API_KEY
  const [movieDetails, setMovieDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const toggleExpand = () => {
    setIsOpen(isOpen === 'Open' ? 'Close' : 'Open')
  }

  const fetchMovieDetails = async () => {
    if (movieDetails) {
      return
    }

    setLoading(true)
    try {
      const res = await axios.get(
        `https://www.omdbapi.com/?apikey=${apikey}&i=${movie.imdbID}`
      )
      const data = res.data
      if (data.Response === "True") {
        setMovieDetails(data)
      } else {
        setError(data.Error || "Error while getting movie details!")
      }
    } catch (err) {
      setError("Failed to get details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen === 'Open' && !movieDetails) { 
      fetchMovieDetails()
    }
  }, [isOpen, movieDetails])

  const memoizedDetails = useMemo(() => movieDetails, [movieDetails])

  return (
    <div className="movie-item" onClick={toggleExpand}>
      <div className={`img-section-${isOpen}`}>
        <img src={movie.Poster} alt={movie.Title} className="movie-poster" />
      </div>
      <div>
        <h3 className="movie-title">{movie.Title}</h3>
        <p className="movie-year">Year: {movie.Year}</p>
        {isOpen === 'Open' && (
          <div className="movie-details">
            {loading && <p>Loading movie details...</p>}
              {error && <p style={{ color: "red" }}>{error}</p>}
              {memoizedDetails && (
                <div>
                  <p><strong>Plot:</strong> {memoizedDetails.Plot}</p>
                  <p><strong>Director:</strong> {memoizedDetails.Director}</p>
                  <p><strong>Actors:</strong> {memoizedDetails.Actors}</p>
                  <strong>More Info:</strong>
                  <a
                    href={`https://www.imdb.com/title/${movie.imdbID}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on IMDb
                  </a>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieItem;


