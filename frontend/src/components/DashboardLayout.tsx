import React, { useState } from "react";
import TopBar from "./TopBar.tsx";
import SideMenu from "./SideMenu.tsx";
import MainContent from "./MainContent.tsx";

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <TopBar
        onMenuClick={toggleMenu}
        onToggleDarkMode={onToggleDarkMode}
        darkMode={darkMode}
      />
      <SideMenu open={menuOpen} onClose={toggleMenu} />
      <MainContent>{children}</MainContent>
    </div>
  );
};

export default DashboardLayout;
