import React, { useState, useEffect } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import axios from "axios"
import MovieItem from "./MovieItem"

const MovieList = () => {
    const [movies, setMovies] = useState([])
    const [searchTerm, setSearchTerm] = useState("Avengers")
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const apikey = import.meta.env.VITE_API_KEY

    const fetchMovies = async () => {
        setLoading(true)
        try {
            const res = await axios.get(
                `https://www.omdbapi.com/?apikey=${apikey}&s=${searchTerm}&page=${page}`
            )
            const data = res.data
            if (data.Response === "True") {
                setMovies((prev) => [...prev, ...data.Search])
                setHasMore(data.Search.length > 0)
            } else {
                setError(data.Error || "No results found.")
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
    }, [searchTerm])

    useEffect(() => {
        if (page > 1) fetchMovies()
    }, [page])

    const handleSearch = (term) => {
        setSearchTerm(term)
    }

    return (
        <div>
            <div>
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
                {movies.map((movie) => (
                    <MovieItem key={movie.imdbID} movie={movie} />
                ))}
            </InfiniteScroll>
        </div>
    )
}

export default MovieList
