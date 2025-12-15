import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AppHome from "./pages/AppHome";
import ProtectedRoute from "./components/ProtectedRoute";
import AllShows from "./pages/AllShows";
import Upcoming from "./pages/Upcoming";
import Watchlist from "./pages/Watchlist";
import Favorites from "./pages/Favorites";
import TvShow from "./pages/TvShow";
import Profile from "./pages/Profile";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRoute from "./components/AdminRoute";
import AdminTvShows from "./pages/admin/AdminTvShows";
import AdminAddEpisode from "./pages/admin/AdminAddEpisode";
import AdminAddTvShow from "./pages/admin/AdminAddTvShow";
import AdminEditTvShow from "./pages/admin/AdminEditTvShow";
import AdminEpisodes from "./pages/admin/AdminEpisodes";
import AdminEditEpisode from "./pages/admin/AdminEditEpisode";
import AdminSeasons from "./pages/admin/AdminSeasons";
import AdminAddSeason from "./pages/admin/AdminAddSeason";
import AdminEditSeason from "./pages/admin/AdminEditSeason";
import AdminEditUser from "./pages/admin/AdminEditUser";

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

      <Route
        path="/upcoming"
        element={
          <ProtectedRoute>
            <Upcoming />
          </ProtectedRoute>
        }
      />

      <Route
        path="/watchlist"
        element={
          <ProtectedRoute>
            <Watchlist />
          </ProtectedRoute>
        }
      />

      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tvshow/:id"
        element={
          <ProtectedRoute>
            <TvShow />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/tvshows"
        element={
          <AdminRoute>
            <AdminTvShows />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/add-tvshow"
        element={
          <AdminRoute>
            <AdminAddTvShow />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/add-tvshow"
        element={
          <AdminRoute>
            <AdminAddEpisode />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/edit-tvshow"
        element={
          <AdminRoute>
            <AdminEditTvShow />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/episodes/:showId/:seasonId"
        element={
          <AdminRoute>
            <AdminEpisodes />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/edit-episode"
        element={
          <AdminRoute>
            <AdminEditEpisode />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/seasons/:showId"
        element={
          <AdminRoute>
            <AdminSeasons />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/add-season"
        element={
          <AdminRoute>
            <AdminAddSeason />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/add-episode"
        element={
          <AdminRoute>
            <AdminAddEpisode />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/edit-season"
        element={
          <AdminRoute>
            <AdminEditSeason />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/edit-user"
        element={
          <AdminRoute>
            <AdminEditUser />
          </AdminRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
