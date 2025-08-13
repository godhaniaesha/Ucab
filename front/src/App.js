import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./component/Header";
import Main from "./container/Main";
import "./App.css";
import HomeSlide from "./component/HomeSlide";

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/header" element={<Header />} />
        <Route path="/HomeSlide" element={<HomeSlide />} />

      </Routes>
    </Router>
  );
}

export default App;