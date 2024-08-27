import React, { useState } from "react";
import TopBar from "./TopBar";
import SideMenu from "./SideMenu";
import MainContent from "./MainContent";
import { useTheme, useMediaQuery, Box } from "@mui/material";
import { Outlet } from "react-router-dom";

interface DashboardLayoutProps {
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  onToggleDarkMode,
  darkMode,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* TopBar Component */}
      <TopBar
        onMenuClick={toggleMenu}
        onToggleDarkMode={onToggleDarkMode}
        darkMode={darkMode}
      />
      <Box sx={{ display: "flex", flex: 1 }}>
        {/* SideMenu Component */}
        <SideMenu open={isLargeScreen ? true : menuOpen} onClose={toggleMenu} />
        <MainContent>
          {/* Outlet to render child routes */}
          <Outlet />
        </MainContent>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
