import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Switch,
  useMediaQuery,
  useTheme,
} from "@mui/material";
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
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

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
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            textAlign: isSmallScreen ? "center" : "left",
            marginRight: isSmallScreen ? 0 : "auto",
          }}
        >
          BudgetBuddy
        </Typography>
        {!isSmallScreen && (
          <Switch checked={darkMode} onChange={onToggleDarkMode} />
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;