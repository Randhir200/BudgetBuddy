import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SettingsIcon from '@mui/icons-material/Settings';
import InsightsIcon from '@mui/icons-material/Insights';
import { Link } from "react-router-dom"; // Import Link from react-router-dom

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
      open={open}
      onClose={onClose}
      sx={{
        width: "16.66%",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: "16.66%",
          boxSizing: "border-box",
          marginTop: theme.mixins.toolbar.minHeight, // Adjust margin to avoid overlapping with TopBar
        },
      }}
    >
      <List>
        {/* Use Link component instead of a */}
        <ListItem button component={Link} to="/" onClick={onClose}>
          <ListItemIcon>
            <InsightsIcon />
          </ListItemIcon>
          <ListItemText primary="Insight" />
        </ListItem>
        <ListItem button component={Link} to="/expenses" onClick={onClose}>
          <ListItemIcon>
            <ReceiptLongIcon />
          </ListItemIcon>
          <ListItemText primary="Expenses" />
        </ListItem>
        <ListItem button component={Link} to="/config" onClick={onClose}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Config" />
        </ListItem>
        {/* Add more menu items as needed */}
      </List>
    </Drawer>
  );
};

export default SideMenu;
