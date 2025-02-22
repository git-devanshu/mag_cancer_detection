import React, { useState } from "react";
import "../styles/Signup.css";
import {
  Input,
  Stack,
  InputGroup,
  InputLeftElement,
  Heading,
  Link,
  Button,
  Text,
  Image,
} from "@chakra-ui/react";
import { AtSignIcon, LockIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import vfcodeIcon from "../images/vfcode.png";
import { getBaseURL } from "../utils/helperFunctions";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [showDiv, setShowDiv] = useState(false);
  const [username, setUsername] = useState("");
  const [vfcode, setVfcode] = useState("");
  const [password, setPassword] = useState("");

  const verifyUser = (e) => {
    e.preventDefault();
    if (username === "") {
      toast.error("Please enter your username!");
      return;
    } else if (username.length < 3 || username.length > 20) {
      toast.error("Username must be 3 and 20 characters long!");
      return;
    } else {
      const toastId = toast.loading("Verifying...");
      axios
        .put(`${getBaseURL()}/user/forgot-password/${username}`)
        .then((res) => {
          if (res.status === 200) {
            console.log("response 200 received");
            toast.success(res.data.message, { id: toastId });
            setShowDiv(true);
          } else {
            toast.error(res.data.message, { id: toastId });
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.message, { id: toastId });
        });
    }
  };

  const resetPassword = (e) => {
    e.preventDefault();
    if (!vfcode || password === "") {
      toast.error("All fields are required");
      return;
    } else if (password.length < 8 || password.length > 30) {
      toast.error("Password must be 8 and 30 characters long!");
      return;
    } else {
      const toastId = toast.loading("Setting new password...");
      axios
        .put(`${getBaseURL()}/user/reset-password/${username}`, {
          vfcode,
          password,
        })
        .then((res) => {
          if (res.status === 200) {
            toast.success(res.data.message, { id: toastId });
            setTimeout(() => {
              navigate("/");
            }, 2000);
          } else {
            toast.error(res.data.message, { id: toastId });
          }
        })
        .catch((err) => {
          console.log(err);
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
          <h1
            style={{
              color: "var(--secondary-color)",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            Reset Password
          </h1>

          {!showDiv && (
            <Stack spacing={5} style={{ margin: "40px" }}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <AtSignIcon color="var(--text-light)" />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Username"
                  variant="filled"
                  name="username"
                  value={username}
                  required
                  maxLength={20}
                  minLength={3}
                  onChange={(e) => setUsername(e.target.value)}
                  backgroundColor="var(--primary-color-light)"
                  border="1px solid var(--primary-color)"
                  _placeholder={{ color: "var(--text-light)" }}
                />
              </InputGroup>
              <Button
                onClick={verifyUser}
                colorScheme="blue"
                borderRadius="8px"
                width="140px"
                backgroundColor="var(--primary-color)"
                _hover={{
                  backgroundColor: "var(--primary-color-dark)",
                  color: "var(--white)",
                }}
                alignSelf="center"
                margin={"10px"}
              >
                Verify
              </Button>
            </Stack>
          )}

          {showDiv && (
            <Stack spacing={5} style={{ margin: "30px" }}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Image
                    boxSize="20px"
                    objectFit="cover"
                    src={vfcodeIcon}
                    alt="Verification Code"
                    filter={"invert(35%)"}
                  />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Verification Code"
                  variant="filled"
                  name="vfcode"
                  value={vfcode}
                  required
                  maxLength={6}
                  minLength={6}
                  onChange={(e) => setVfcode(e.target.value)}
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
                  placeholder="New Password"
                  variant="filled"
                  name="password"
                  value={password}
                  required
                  maxLength={30}
                  minLength={8}
                  onChange={(e) => setPassword(e.target.value)}
                  backgroundColor="var(--primary-color-light)"
                  border="1px solid var(--primary-color)"
                  _placeholder={{ color: "var(--text-light)" }}
                />
              </InputGroup>
              <Button
                onClick={resetPassword}
                colorScheme="blue"
                borderRadius="8px"
                width="140px"
                backgroundColor="var(--primary-color)"
                _hover={{
                  backgroundColor: "var(--primary-color-dark)",
                  color: "var(--white)",
                }}
                alignSelf="center"
                margin={"10px"}
              >
                Reset
              </Button>
            </Stack>
          )}

          <Text color={"var(--text-dark)"} align={"center"}>
            Try Login?{" "}
            <Link color="var(--secondary-color)" href="/">
              Login
            </Link>
          </Text>
        </form>
      </div>

      <div
        style={{ display: "grid", placeItems: "center" }}
        className="title-div-sg-lg"
      >
        <div style={{ width: "100%" }}>
          <Heading size={"2xl"} color={"var(--primary-color)"}>
            Team4Real
          </Heading>
          <br />
          <Heading color={"var(--text-dark)"} mb={4}>
            Can't Remember Your Password? <br />
            We've Got You!
          </Heading>
          <Text fontSize={"2xl"} color={"var(--text-light)"}>
            Don't worry, we've got a way!
          </Text>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
