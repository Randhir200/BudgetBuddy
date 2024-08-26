import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import Config from "./pages/Config";
import React, { useState, useMemo } from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Expenses } from "./pages/Expenses";

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
        mixins: {
          toolbar: {
            minHeight: "50px",
          },
        },
      }),
    [darkMode]
  );

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <DashboardLayout onToggleDarkMode={toggleDarkMode} darkMode={darkMode}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/config" element={<Config />} />
          </Routes>
        </DashboardLayout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
