import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Insight from "./pages/Insight";
import { DashboardLayout } from "./components/Common/DashboardLayout";
import React, { useState, useMemo } from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import Expense from "./pages/Expense";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PageNotFound from "./pages/PageNotFound";
import PrivateRoute from "./components/Common/PrivateRoute";
import Income from "./pages/Income";
import ExpenseType from "./pages/ExpenseType";

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
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />4
          <Route path="*" element={<PageNotFound />} />4
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardLayout
                  onToggleDarkMode={toggleDarkMode}
                  darkMode={darkMode}
                >
                  <Insight />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/expense"
            element={
              <PrivateRoute>
                <DashboardLayout
                  onToggleDarkMode={toggleDarkMode}
                  darkMode={darkMode}
                >
                  <Expense />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/expenseType"
            element={
              <PrivateRoute>
                <DashboardLayout
                  onToggleDarkMode={toggleDarkMode}
                  darkMode={darkMode}
                >
                  <ExpenseType />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/income"
            element={
              <PrivateRoute>
                <DashboardLayout
                  onToggleDarkMode={toggleDarkMode}
                  darkMode={darkMode}
                >
                  <Income />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
