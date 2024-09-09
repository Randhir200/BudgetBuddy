import React, { useState } from "react";
import { Grid, useTheme, useMediaQuery } from "@mui/material";
import TopBar from "./TopBar";
import SideMenu from "./SideMenu";
import MainContent from "./MainContent";

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
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Grid container direction="column" style={{ height: "100vh" }}>
      {/* TopBar */}
      <Grid item>
        <TopBar
          onMenuClick={toggleMenu}
          onToggleDarkMode={onToggleDarkMode}
          darkMode={darkMode}
        />
      </Grid>

      {/* Body: SideMenu and MainContent */}
      <Grid item container style={{ flexGrow: 1, border:"1px solid yellow", width: "100vw" }}>
        {/* SideMenu */}
        {isLargeScreen && (
          <Grid item xs={2} sx={{border:"1px solid green"}} >
            {/* <div style={{marginTop: "50px", border:"1px solid grey"}}>
              Side Menu
            </div> */}
            <SideMenu open={menuOpen} onClose={toggleMenu} />
          </Grid>
        )}

        {/* MainContent */}
        <Grid item xs={isLargeScreen ? 10 : 12} sx={{border:"1px solid red"}}>
          <MainContent>{children}</MainContent>
          {/* <div style={{marginTop: "50px", border: "1px solid red"}}>
            Dashboard
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repudiandae, atque.</p>
          </div> */}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashboardLayout;
