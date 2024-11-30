import React, { useState, useEffect } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import axios from "axios"
import MovieItem from "./MovieItem"
import useDebounce from "../hooks/useDebounce"; 

const MovieList = () => {
    const [movies, setMovies] = useState([])
    const [searchTerm, setSearchTerm] = useState("Avengers")
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const apikey = import.meta.env.VITE_API_KEY

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const fetchMovies = async () => {
        setLoading(true)
        try {
            const res = await axios.get(
                `https://www.omdbapi.com/?apikey=${apikey}&s=${searchTerm === ''? 'Avengers': searchTerm}&page=${page}`
            )
            const data = res.data
            if (data.Response === "True") {
                setMovies((prev) => [...prev, ...data.Search])
                setHasMore(data.Search.length > 0)
                setError('')
            } else {
                if(data.Error === 'Too many results.') {
                    setError('Too many results, Type to refine further.')
                } else {
                    setError(data.Error || "No results found.")
                }
            }
        } catch (err) {
            setError("Failed to fetch movies. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setMovies([])
        setPage(1)
        setHasMore(true)
        fetchMovies()
    }, [debouncedSearchTerm])

    useEffect(() => {
        if (page > 1) fetchMovies()
    }, [page])

    const handleSearch = (term) => {
        setSearchTerm(term)
    }

    return (
        <div className="movie-list-container">
            <div className="search-bar">
                <input 
                    type="text" 
                    placeholder="Search movies..." 
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            {error && <p className="error">{error}</p>}
            <InfiniteScroll
                dataLength={movies.length}
                next={() => setPage((prev) => prev + 1)}
                hasMore={hasMore}
                loader={loading && <p>Loading...</p>}
            >
                <div className="movie-grid">
                    {movies.map((movie) => (
                        <MovieItem key={movie.imdbID} movie={movie} />
                    ))}
                </div>
            </InfiniteScroll>
        </div>
    )
}

export default MovieList
