import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Header from "./component/Header";
import Main from "./container/Main";
import "./App.css";

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/header" element={<Header />} />
      </Routes>
    </Router>
  );
}

export default App;