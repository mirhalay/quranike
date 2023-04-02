import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import { HashRouter, Route, Routes } from "react-router-dom";

function Index() {
  return (
    <HashRouter>
      <Routes>
        <Route index element={<App />} />
      </Routes>
    </HashRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Index />);
