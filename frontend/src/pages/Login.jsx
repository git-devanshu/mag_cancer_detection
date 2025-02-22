import React, { useState } from "react";
import "../styles/Signup.css";
import { getBaseURL } from "../utils/helperFunctions";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Stack,
  InputGroup,
  InputLeftElement,
  Heading,
  Link,
  Button,
  Text,
} from "@chakra-ui/react";
import { AtSignIcon, LockIcon } from "@chakra-ui/icons";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const loginUser = async (e) => {
    e.preventDefault();
    if (!e.target.form.reportValidity()) {
      return;
    } else if (user.username === "" || user.password === "") {
      toast.error("All fields are required");
    } else if (user.username.length < 3 || user.username.length > 20) {
      toast.error("Username should be 3 to 20 characters long");
    } else if (user.password.length < 8 || user.password.length > 30) {
      toast.error("Password should be 8 to 30 characters long");
    } else {
      const toastId = toast.loading("Logging in...");
      await axios
        .put(getBaseURL() + "/user/login", user)
        .then((res) => {
          if (res.status === 200) {
            toast.success(res.data.message, { id: toastId });
            sessionStorage.setItem("token", res.data.token);
            setTimeout(() => {
              navigate("/profile");
            }, 1500);
          } else {
            toast.error(res.data.message, { id: toastId });
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.response.data.message, { id: toastId });
        });
    }
  };

  return (
    <div
      className="parent-sg"
      style={{
        backgroundColor: "var(--primary-color-light)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Form Div */}
      <div
        style={{
          display: "grid",
          placeItems: "center",

          marginRight: "8rem",
        }}
      >
        <form
          className="form-div-sg-lg"
          style={{
            backgroundColor: "var(--white)",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1 style={{ color: "var(--secondary-color)", textAlign: "center" }}>
            Login
          </h1>
          <Stack spacing={5} style={{ margin: "30px" }}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <AtSignIcon color="var(--text-light)" />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="username"
                variant="filled"
                name="username"
                value={user.username}
                required
                maxLength={20}
                minLength={3}
                onChange={handleChange}
                backgroundColor="var(--primary-color-light)"
                border="1px solid var(--primary-color)"
                _placeholder={{ color: "var(--text-light)" }}
              />
            </InputGroup>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <LockIcon color="var(--text-light)" />
              </InputLeftElement>
              <Input
                type="password"
                placeholder="password"
                variant="filled"
                name="password"
                value={user.password}
                required
                maxLength={30}
                minLength={8}
                onChange={handleChange}
                backgroundColor="var(--primary-color-light)"
                border="1px solid var(--primary-color)"
                _placeholder={{ color: "var(--text-light)" }}
              />
            </InputGroup>
            <Text align={"center"}>
              <Link color="var(--secondary-color)" href="/reset-password">
                Forgot Password?
              </Link>
            </Text>
            <Button
              onClick={loginUser}
              colorScheme="blue"
              borderRadius="8px"
              width="140px"
              backgroundColor="var(--primary-color)"
              _hover={{
                backgroundColor: "var(--primary-color-dark)",
                color: "var(--white)",
              }}
              alignSelf="center"
            >
              Login
            </Button>
          </Stack>
          <Text color={"var(--text-dark)"} align={"center"}>
            New User?{" "}
            <Link color="var(--secondary-color)" href="/signup">
              Signup
            </Link>
          </Text>
        </form>
      </div>

      {/* Title Div */}
      <div
        style={{ display: "grid", placeItems: "center" }}
        className="title-div-sg-lg"
      >
        <div style={{ width: "100%" }} className="mt-10">
          <Heading size={"2xl"} color={"var(--primary-color)"}>
            Team4Real
          </Heading>
          <br />
          <Heading color={"var(--text-dark)"} mb={4}>
            AI-Powered skin cancer detection
            <br /> system
          </Heading>
          <Text fontSize={"2xl"} color={"var(--text-light)"}>
            Welcome Back!
          </Text>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
