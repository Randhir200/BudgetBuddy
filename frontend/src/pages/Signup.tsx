import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Response {
  message: string;
  status: number;
  data: {
    token: string;
  };
}

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log(re.test(email));
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    // Example: Password should be at least 8 characters, contain at least one letter and one number
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    console.log(re.test(password));
    return re.test(password);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (firstName && lastName && email && password && cpassword) {
        if (!validateEmail(email)) {
          setError("Invalid email address");
          setEmail("");
          return;
        }
        if (!validatePassword(password)) {
          setError(
            "Password must be at least 8 characters long and contain at least one letter and one number"
          );
          setPassword("");
          setCpassword("");
          return;
        }
        if (password === cpassword) {
          const res: Response = await axios.post(
            "http://localhost:9000/user/signup",
            { firstName, lastName, email, password, cpassword }
          );
          if (res.status === 201) {
            const token = res.data.token;
            console.log(token);
            if (token) {
              localStorage.setItem("auth-token", token);
              navigate("/login");
            } else {
              setError("No authentication token received");
            }
          }
        } else {
          setError("Passwords are not matching!");
        }
      } else {
        setError("Please fill all the inputs");
      }
    } catch (err) {
      console.error(err);
      console.log(error);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
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
  height: 100vh;
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
