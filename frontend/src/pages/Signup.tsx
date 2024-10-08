import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios, {AxiosError} from "axios";
import { AlertProps } from "@mui/material/Alert";
import { SnackbarOrigin } from "@mui/material/Snackbar";
import { AlertComp } from "../components/AlertComp";
import {authApiUrl} from "../config/config";
import {LinearProgress} from "@mui/material";


interface Response {
  message: string;
  status: number;
  data: {
    token: string;
  };
}

interface State extends SnackbarOrigin {
  open: boolean;
}

interface alertState extends AlertProps {
  message: string
}

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastState, setToastState] = React.useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const [alertState, setAlertState] = React.useState<alertState>({ severity: "error", message: '' });

  const { open, vertical, horizontal } = toastState;

  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !re.test(email);
  };

  const validatePassword = (password: string) => {
    // Example: Password should be at least 8 characters, contain at least one letter and one number
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return !re.test(password);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (firstName && lastName && email && password && cpassword) {
        if (validateEmail(email)) {
          return;
        }
        if (validatePassword(password)) {
          setAlertState({
            ...alertState,
            severity: "error",
            message: "Password must be at least 8 characters long and contain at least one letter and one number"
          });
          setPassword("");
          setCpassword("");
        }
        if (password === cpassword) {
          setLoading(true);
          const res: Response = await axios.post(
            `${authApiUrl}/signup`,
            { firstName, lastName, email, password, cpassword },
            {
              headers: { 'Content-Type': 'application/json', 
              'Authorization': 'Bearer token' }
            }
          );
          if (res.status === 201) {
            const token = res.data.token;
            if (token) {
              localStorage.setItem("auth-token", token);
              navigate("/login");
              setAlertState({
                ...alertState,
                severity: "success",
                message: "Signup successfully"
              });
            } else {
              setAlertState({
                ...alertState,
                severity: "info",
                message: "No authentication token received"
              });
            }
          }
        } else {
          setAlertState({
            ...alertState,
            severity: "error",
            message: "Passwords are not matching!"
          });
        }
      } else {
        setAlertState({
          ...alertState,
          severity: "warning",
          message: "Please fill all the inputs"
        });
      }
    } catch (error: any) {
      setLoading(false);
      if (AxiosError) {
        setAlertState({ ...alertState, severity: 'error', message: error.message })
      }
      setAlertState({ ...alertState, severity: 'error', message: error.response.data.error})

    } finally {
      setLoading(false);
      setToastState({ ...toastState, open: true });
      setTimeout(() => {
        setToastState({ ...toastState, open: false });
      }, 2000); // Close after 2 seconds
    }
  };


  return (
    <Container>
      <AlertComp vertical={vertical} horizontal={horizontal} open={open}
        alertState={alertState}
      />      <Form onSubmit={handleSubmit}>
        <Title>Sign Up</Title>
        <Input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
        />
        <Input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
        />
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
        <Input
          type="password"
          value={cpassword}
          onChange={(e) => setCpassword(e.target.value)}
          placeholder="Confirm Password"
        />

        {loading && <LinearProgress style={{borderRadius:"0.5rem 0.5rem 0 0"}}/>}
        <Button type="submit">Sign Up</Button>
        <p className="switch">
          Already a user? <Link to={"/login"}>login</Link>{" "}
        </p>
      </Form>
    </Container>
  );
};

export default Signup;

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
