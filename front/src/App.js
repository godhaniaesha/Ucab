import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./container/Main";
import Home from "./pages/Home";
import About from "./pages/About";
import Taxi from "./pages/Taxi";
import Service from "./pages/Service";
import Pages from "./pages/Pages";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import "./App.css";
import Footer from "./component/Footer";
import HomeSlide from "./component/HomeSlide";
import CarDetails from "./pages/CarDetails";
import Faq from "./pages/Faq";
import AdminLayout from "./pages/AdminLayout";
import Tab from "./pages/Tab";
import SuperAdminTab from "./pages/SuperAdminTab";
import PassengerTab from "./pages/PassengerTab";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Main>
              <Home />
            </Main>
          }
        />
        <Route
          path="/home"
          element={
            <Main>
              <Home />
            </Main>
          }
        />
        <Route
          path="/about"
          element={
            <Main>
              <About />
            </Main>
          }
        />
        <Route
          path="/taxi"
          element={
            <Main>
              <Taxi />
            </Main>
          }
        />
        <Route
          path="/service"
          element={
            <Main>
              <Service />
            </Main>
          }
        />
        <Route
          path="/pages"
          element={
            <Main>
              <Pages />
            </Main>
          }
        />
        <Route
          path="/faq"
          element={
            <Main>
              <Faq />
            </Main>
          }
        />
        <Route
          path="/blog"
          element={
            <Main>
              <Blog />
            </Main>
          }
        />
        <Route
          path="/contact"
          element={
            <Main>
              <Contact />
            </Main>
          }
        />
        <Route
          path="/CarDetails"
          element={
            <Main>
              <CarDetails />
            </Main>
          }
        />

        <Route path="/footer" element={<Footer />} />
        <Route path="/HomeSlide" element={<HomeSlide />} />

        <Route path="/admin" element={<AdminLayout />}></Route>
        <Route path="/tab" element={<Tab />} />
        <Route path="/SuperAdminTab" element={<SuperAdminTab />} />
        <Route path="/PassengerTab" element={<PassengerTab />} />
      </Routes>
    </Router>
  );
}

export default App;
