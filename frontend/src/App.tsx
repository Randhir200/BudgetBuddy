import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
    mixins: {
      toolbar: {
        minHeight: "50px",
      },
    },
  });

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
            {/* <Route path="expensess" element={<Expenses />} /> */}
          </Routes>
        </DashboardLayout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
