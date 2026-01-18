// movieCard.tsx
import { Link } from "react-router-dom";
import type { Movie } from "../types/movie"; // Assuming you have a Movie type

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  // ADD THIS LINE FOR DEBUGGING
  console.log("movieCard received movie:", movie);

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      {/* ... rest of your component */}
    </Link>
  );
};

export default MovieCard;