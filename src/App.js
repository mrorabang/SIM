import "./App.css";
import Contact from "./components/Contact";
import CreateImage from "./components/CreateImage";
import { Routes, Route, Link } from "react-router-dom";
import React, { useState } from "react";
import Filter from "./components/Filter";
import Menu from "./components/Menu";
function App() {
  return (
      <>
        <Menu/>
        <Routes>
          <Route path="/" element={<CreateImage/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/filter" element={<Filter/>}/>
        </Routes>
      </>
  );
}
export default App;
