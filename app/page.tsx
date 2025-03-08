"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

type Movie = {
  title: string;
  year: string;
  imdb_id: string;
  image_url?: string;
};

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getLatestMovies() {
      setLoading(true);
      console.log("Fetching latest movies....");
      try {
        const response = await axios.get(
          "https://movies-tv-shows-database.p.rapidapi.com/",
          {
            headers: {
              "x-rapidapi-key": process.env.RAPIDAPIKEY,
              "x-rapidapi-host": process.env.RAPIDAPIHOST,
              Type: "get-recently-added-movies",
            },
            params: {
              page: pageNumber,
            },
          }
        );
        console.log(response.data);
        const pages = Math.ceil(response.data.Total_results / 20);
        console.log(pages);
        setTotalPages(pages);
        const moviesList = response.data.movie_results || [];

        const moviesWithImages = await Promise.all(
          moviesList.map(async (movie: Movie) => {
            const imageResponse = await axios.get(
              "https://movies-tv-shows-database.p.rapidapi.com/",
              {
                headers: {
                  "x-rapidapi-key": process.env.RAPIDAPIKEY,
                  "x-rapidapi-host": process.env.RAPIDAPIHOST,
                  Type: "get-movies-images-by-imdb",
                },
                params: {
                  movieid: movie.imdb_id,
                },
              }
            );
            console.log(imageResponse.data);
            return {
              ...movie,
              image_url: imageResponse.data.poster || "",
            };
          })
        );
        setMovies(moviesWithImages);
        console.log(moviesWithImages);
      } catch (error) {
        console.log("Error fetching latest movies.", error);
      } finally {
        setLoading(false);
      }
    }
    getLatestMovies();
  }, [pageNumber]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Movies List</h1>
      <div className="flex flex-wrap justify-center gap-4">
        {loading ? (
          <h2 className="text-center w-full">Loading...</h2>
        ) : movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie.imdb_id}
              className="w-[23%] min-w-[200px] p-4 border rounded-lg shadow-lg bg-white"
            >
              <Image
                src={movie.image_url || "/movie.jpg"}
                alt={movie.title}
                width={250}
                height={350}
                priority
                className="w-full h-auto rounded-md"
              />
              <div className="mt-2 text-center">
                <h2 className="text-lg font-semibold">{movie.title}</h2>
                <p className="text-gray-600">Year: {movie.year}</p>
              </div>
            </div>
          ))
        ) : (
          <h2 className="text-center w-full">No movies found.</h2>
        )}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber === 1}
        >
          Previous
        </Button>
        <span className="font-medium text-lg">
          Page {pageNumber} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() =>
            setPageNumber((prev) => (prev < totalPages ? prev + 1 : prev))
          }
          disabled={pageNumber >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Home;
