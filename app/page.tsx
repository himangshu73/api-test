"use client";

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

  useEffect(() => {
    async function getLatestMovies() {
      console.log("Fetching latest movies....");
      try {
        const response = await axios.get(
          "https://movies-tv-shows-database.p.rapidapi.com/",
          {
            headers: {
              "x-rapidapi-key":
                "0f1646953emshf8d866fe8a4c87cp1e3482jsn1446e4418c6c",
              "x-rapidapi-host": "movies-tv-shows-database.p.rapidapi.com",
              Type: "get-recently-added-movies",
            },
            params: {
              page: "100",
            },
          }
        );
        console.log(response.data);
        const totalPages = Math.ceil(response.data.Total_results / 20);
        console.log(totalPages);
        const moviesList = response.data.movie_results || [];

        const moviesWithImages = await Promise.all(
          moviesList.map(async (movie: Movie) => {
            const imageResponse = await axios.get(
              "https://movies-tv-shows-database.p.rapidapi.com/",
              {
                headers: {
                  "x-rapidapi-key":
                    "0f1646953emshf8d866fe8a4c87cp1e3482jsn1446e4418c6c",
                  "x-rapidapi-host": "movies-tv-shows-database.p.rapidapi.com",
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
      }
    }
    getLatestMovies();
  }, []);
  return (
    <div>
      <h1>Movies List</h1>
      <div>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.imdb_id}>
              <Image
                src={movie.image_url || "/movie.jpg"}
                alt={movie.title}
                width={250}
                height={350}
              />
              <div>
                <h2>{movie.title}</h2>
                <p>Year:{movie.year}</p>
              </div>
            </div>
          ))
        ) : (
          <h2>No movies available.</h2>
        )}
      </div>
    </div>
  );
};

export default Home;
