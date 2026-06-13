import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useEffect } from "react";

import Dashboard from "./Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

import "./App.css";

function ProtectedRoute({
  children,
}) {
  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  return user ? (
    children
  ) : (
    <Navigate
      to="/login"
    />
  );
}

function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Register */}
        <Route
          path="/register"
          element={
            <Register />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;