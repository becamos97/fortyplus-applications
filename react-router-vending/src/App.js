
import React from "react";
import { BrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar";
import RoutesList from "./RoutesList";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <RoutesList />
      </BrowserRouter>
    </div>
  );
}

export default App;