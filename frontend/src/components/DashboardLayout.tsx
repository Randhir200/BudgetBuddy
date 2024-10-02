import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  CssBaseline,
} from '@mui/material';
import SideMenu from './SideMenu';
import TopBar from './TopBar';
import MainContent from './MainContent';


const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface DashboardLayoutProps {
  children: React.ReactNode;
  onToggleDarkMode: () => void;
  darkMode: boolean;
}


export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, onToggleDarkMode, darkMode }) => {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Topbar */}
      <TopBar onToggleDarkMode={onToggleDarkMode} darkMode={darkMode}
        handleDrawerOpen={handleDrawerOpen} open={open} />

      {/* SideMenu  */}
      <SideMenu open={open} handleDrawerClose={handleDrawerClose} />

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <MainContent >{children}</MainContent>
      </Box>
    </Box>
  );
}
