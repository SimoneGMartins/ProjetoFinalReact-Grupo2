import React, { useState, useEffect } from "react";
import AppRouter from "./routes/AppRouter";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Atualiza classe global no HTML sempre que mudar
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <AppRouter isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
  );
};

export default App;
