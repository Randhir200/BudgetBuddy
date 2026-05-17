import React from "react";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import {
  Toolbar,
  IconButton,
  Typography,
  Switch,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { startGmailConnect } from "../../configs/apiClient";

const drawerWidth = 240;


interface TopBarProps {
  open: boolean;
  handleDrawerOpen: () => void;
  onToggleDarkMode: () => void;
  darkMode: boolean;
}


interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));


const TopBar: React.FC<TopBarProps> = ({
  open,
  handleDrawerOpen,
  darkMode,
  onToggleDarkMode
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <AppBar position="fixed" open={open}>
    <Toolbar sx={{display: "flex", justifyContent: "space-between"}}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        edge="start"
        sx={[
          {
            marginRight: 5,
          },
          open && { display: 'none' },
        ]}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap component="div">
        BudgetBuddy
      </Typography>
      <Toolbar sx={{ gap: 1, minHeight: "auto !important" }}>
        <Button
          color="inherit"
          size="small"
          startIcon={<MarkEmailReadIcon />}
          onClick={startGmailConnect}
        >
          Gmail
        </Button>
        <IconButton color="inherit" onClick={handleLogout} aria-label="logout">
          <LogoutIcon />
        </IconButton>
        <Switch sx={{float:"right"}} checked={darkMode} onChange={onToggleDarkMode} />
      </Toolbar>
    </Toolbar>
  </AppBar>
  );
};

export default TopBar;
