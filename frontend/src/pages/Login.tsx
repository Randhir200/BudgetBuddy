import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "@mui/material";
import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";

interface Response {
  status: number;
  data: {
    message: string;
    token: string;
    status: string;
  };
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState<AlertColor>("success");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (email && password) {
        const response: Response = await axios.post(
          "http://localhost:9000/user/login",
          {
            email,
            password,
          }
        );
        console.log(response);
        if (response.status === 201) {
          const token = response.data.token;
          if (token) {
            localStorage.setItem("auth-token", token);
            navigate("/");
          } else {
            console.error("No authentication token received");
          }
        }
      } else {
        setError("Please fill all input fields");
        setErrorType("warning");
        setOpen(true);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.status === 401) {
          setError(err.response?.data.message);
          setErrorType("warning");
          setOpen(true);
        }
        console.error(err);
      }
    }
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Container>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={errorType}
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
      <Form onSubmit={handleSubmit}>
        <Title>Login</Title>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <Button type="submit">Login</Button>
        <p className="switch">
          New to BudgetBuddy? <Link to={"/signup"}>Signup</Link>{" "}
        </p>
      </Form>
    </Container>
  );
};

export default Login;

// Styled components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #fff;
`;

const Form = styled.form`
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  .switch {
    margin-top: 10px;
  }
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: transparent;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;
