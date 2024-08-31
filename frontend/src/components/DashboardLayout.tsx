import React, { useState } from "react";
import TopBar from "./TopBar";
import SideMenu from "./SideMenu";
import MainContent from "./MainContent";
// import { useTheme, useMediaQuery } from "@mui/material"

interface DashboardLayoutProps {
  children: React.ReactNode;
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  onToggleDarkMode,
  darkMode,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  //   const theme = useTheme();
  //   const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <TopBar
        onMenuClick={toggleMenu}
        onToggleDarkMode={onToggleDarkMode}
        darkMode={darkMode}
      />
      <div style={{ display: "flex", flex: 1}}>
        <SideMenu open={menuOpen} onClose={toggleMenu} />
        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
};

export default DashboardLayout;
