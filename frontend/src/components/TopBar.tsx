import React from "react";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import {
  Toolbar,
  IconButton,
  Typography,
  Switch,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

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
      <Switch sx={{float:"right"}} checked={darkMode} onChange={onToggleDarkMode} />
    </Toolbar>
  </AppBar>
  );
};

export default TopBar;
