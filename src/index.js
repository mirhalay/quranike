import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import { HashRouter, Route, Routes } from "react-router-dom";

function Index() {
  const [colorMode, setColorMode] = useState(() => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18 ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", colorMode);
  }, [colorMode]);

  return (
    <HashRouter>
      <Routes>
        <Route
          index
          element={<App colorMode={colorMode} setColorMode={setColorMode} />}
        />
      </Routes>
    </HashRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Index />);
