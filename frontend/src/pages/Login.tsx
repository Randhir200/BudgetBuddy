import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {AlertProps } from "@mui/material/Alert";
import { AlertComp } from "../components/AlertComp";
import { SnackbarOrigin } from "@mui/material/Snackbar";


interface Response {
    status: number;
    data: {
        message: string;
        token: string;
        status: string;
    };
}

interface State extends SnackbarOrigin {
    open: boolean;
}

interface alertState extends AlertProps {
    message: string
}

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [toastState, setToastState] = React.useState<State>({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });
    const [alertState, setAlertState] = React.useState<alertState>({ severity: "success", message: '' });

    const { open, vertical, horizontal } = toastState;
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response: Response = await axios.post(
                "http://localhost:9000/login",
                {
                    email,
                    password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer token'
                    }
                }
            );
            const token = response.data.token;
            localStorage.setItem("auth-token", token);
            
            //after logged in redirect to home page 
            navigate('/');
            setAlertState({
                ...alertState,
                severity: "success",
                message: response.data.message
            });

        } catch (error: any) {
            if (AxiosError) {
                setAlertState({ ...alertState, severity: 'error', message: error.message })
            }
            setAlertState({ ...alertState, severity: 'error', message: error.message })

        } finally {
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
  background-color: #fff;
  height: "auto";
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
