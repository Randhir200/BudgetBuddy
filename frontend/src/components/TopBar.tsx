import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Switch } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

interface TopBarProps {
  onMenuClick: () => void;
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  onMenuClick,
  onToggleDarkMode,
  darkMode,
}) => {
  return (
    <AppBar>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 2 }}>
          BudgetBudd
        </Typography>
        <Switch checked={darkMode} onChange={onToggleDarkMode} />
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
