import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useTheme, useMediaQuery } from "@mui/material";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Drawer
      variant={isLargeScreen ? "permanent" : "temporary"}
      open={isLargeScreen || open}
      onClose={onClose}
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          marginTop: 7, // Adjust margin to avoid overlapping with TopBar
        },
      }}
    >
      <List>
        <ListItem button component="a" href="/">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component="a" href="/expenses">
          <ListItemIcon>
            <AttachMoneyIcon />
          </ListItemIcon>
          <ListItemText primary="Expenses" />
        </ListItem>
        {/* Add more menu items as needed */}
      </List>
    </Drawer>
  );
};

export default SideMenu;
