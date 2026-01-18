import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import MovieDetail from "./pages/movieDetail";
import Favorites from "./pages/favorite";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<MovieDetail />} />
      <Route path="/favorites" element={<Favorites />} />
    </Routes>
  );
}

export default App;