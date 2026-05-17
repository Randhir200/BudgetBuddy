import React from "react";
import { Button, Paper, Stack, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { startGoogleLogin } from "../configs/apiClient";

const Login: React.FC = () => {
  return (
    <Stack
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
      sx={{ backgroundColor: "#f7f8fb", px: 2 }}
    >
      <Paper elevation={2} sx={{ width: "100%", maxWidth: 380, p: 4, borderRadius: 2 }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h5" fontWeight={700}>
              BudgetBuddy
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in with Google to continue.
            </Typography>
          </Stack>

          <Button
            fullWidth
            size="large"
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={startGoogleLogin}
          >
            Continue with Google
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default Login;
