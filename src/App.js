import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Cards from "./components/Cards";
import AddMovie from "./components/AddMovie";
import AdminPanel from "./components/AdminPanel";
import "./App.css";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Cards />} />
        <Route
          path="/addmovie"
          element={isAdmin ? <AddMovie /> : <Navigate to="/admin" />}
        />
        <Route
          path="/admin"
          element={<AdminPanel onAdminLogin={setIsAdmin} />}
        />
      </Routes>
    </div>
  );
}

export default App;
