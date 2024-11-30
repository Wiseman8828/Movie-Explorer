import React, { useState } from "react";

const MovieItem = ({ movie }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="movie-item" onClick={() => setIsOpen(!isOpen)}>
      <h3>{movie.Title}</h3>
      {isOpen && (
        <div className="movie-details">
          <p><strong>Year:</strong> {movie.Year}</p>
          {movie.Poster && <img src={movie.Poster} alt="Movie Poster" />}
        </div>
      )}
    </div>
  );
};

export default MovieItem;


