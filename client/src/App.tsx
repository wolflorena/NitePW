import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AppHome from "./pages/AppHome";
import ProtectedRoute from "./components/ProtectedRoute";
import AllShows from "./pages/AllShows";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/allshows"
        element={
          <ProtectedRoute>
            <AllShows />
          </ProtectedRoute>
        }
      />

      {/* placeholder până le migrezi */}
      <Route path="/admin" element={<div>Admin TODO</div>} />
      <Route path="/upcoming" element={<div>Upcoming TODO</div>} />
      <Route path="/watchlist" element={<div>Watchlist TODO</div>} />
      <Route path="/favorites" element={<div>Favorites TODO</div>} />
      <Route path="/profile" element={<div>Profile TODO</div>} />
      <Route path="/allshows" element={<div>Allshows TODO</div>} />
      <Route path="/tvshow/:id" element={<div>TV Show TODO</div>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
