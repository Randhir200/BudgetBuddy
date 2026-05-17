import React, { useEffect } from "react";
import { LinearProgress } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("auth-token", token);
      navigate("/", { replace: true });
      return;
    }

    navigate("/login", { replace: true });
  }, [navigate, searchParams]);

  return <LinearProgress />;
};

export default AuthCallback;
