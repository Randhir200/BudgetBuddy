import React, { useEffect, useState } from "react";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import {
  Toolbar,
  IconButton,
  Typography,
  Switch,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import SyncIcon from "@mui/icons-material/Sync";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { getGmailStatus, startGmailConnect, syncGmailNow } from "../../configs/apiClient";
import { useSnackbar } from "notistack";

const drawerWidth = 240;

interface GmailStatus {
  connected: boolean;
  googleEmail: string | null;
  lastSyncedAtSeconds: number | null;
  lastError: string | null;
}


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
  const { enqueueSnackbar } = useSnackbar();
  const [gmailStatus, setGmailStatus] = useState<GmailStatus | null>(null);
  const [gmailLoading, setGmailLoading] = useState(false);
  const [gmailStatusLoading, setGmailStatusLoading] = useState(true);

  useEffect(() => {
    let active = true;

    setGmailStatusLoading(true);
    getGmailStatus()
      .then((response) => {
        if (active) setGmailStatus(response.data.data);
      })
      .catch(() => {
        if (active) setGmailStatus(null);
      })
      .finally(() => {
        if (active) setGmailStatusLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const handleGmailClick = async () => {
    if (!gmailStatus?.connected) {
      startGmailConnect();
      return;
    }

    try {
      setGmailLoading(true);
      const response = await syncGmailNow();
      const { saved = 0, skipped = 0, lastSyncedAtSeconds = null } = response.data;
      setGmailStatus((current) => current
        ? { ...current, lastSyncedAtSeconds, lastError: null }
        : current
      );
      enqueueSnackbar(`Gmail synced: ${saved} saved, ${skipped} skipped`, { variant: "success" });
    } catch (error: unknown) {
      const responseError = error as { response?: { data?: { error?: string } } };
      const message = responseError.response?.data?.error || "Gmail sync failed";
      enqueueSnackbar(message, { variant: "error" });
      setGmailStatus((current) => current ? { ...current, lastError: message } : current);
    } finally {
      setGmailLoading(false);
    }
  };

  const gmailTooltip = gmailStatus?.connected
    ? `Sync Gmail${gmailStatus.googleEmail ? ` (${gmailStatus.googleEmail})` : ""}`
    : "Connect Gmail";

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
        <Tooltip title={gmailTooltip}>
          <span>
            <Button
              color="inherit"
              size="small"
              startIcon={
                gmailLoading || gmailStatusLoading
                  ? <CircularProgress color="inherit" size={16} />
                  : gmailStatus?.connected
                    ? <SyncIcon />
                    : <MarkEmailReadIcon />
              }
              onClick={handleGmailClick}
              disabled={gmailLoading || gmailStatusLoading}
            >
              {gmailStatusLoading ? "Gmail" : gmailStatus?.connected ? "Sync Gmail" : "Connect Gmail"}
            </Button>
          </span>
        </Tooltip>
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
