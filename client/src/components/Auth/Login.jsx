import { Button, ButtonGroup, Heading, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import { Form, Formik } from "formik";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { AccountContext } from "../AccountContext";
import TextField from "../TextField";

const Login = () => {
  const { setUser } = useContext(AccountContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={Yup.object({
        username: Yup.string()
          .required("Username is required")
          .min(6, "Username too short")
          .max(28, "Username too long"),
        password: Yup.string()
          .required("Password is required")
          .min(6, "Password too short")
          .max(28, "Password too long"),
      })}
      onSubmit={(values, actions) => {
        actions.resetForm();
        setError("");
        axios
          .post("/api/auth/login", { ...values })
          .then(({ data }) => {
            if (!data) return;

            setUser({ ...data });

            if (data.status) {
              setError(data.status);
            } else if (data.loggedIn) {
              localStorage.setItem("token", data.token);
              navigate("/home");
            }
          })
          .catch((error) => setError(error.response.data.status));
      }}
    >
      <VStack
        as={Form}
        width={{ base: "90%", md: "500px" }}
        m="auto"
        justify="center"
        h="100vh"
        spacing={"1rem"}
      >
        <Heading>Log In</Heading>
        {error && (
          <Text as="p" color="red.500">
            {error}
          </Text>
        )}

        <TextField
          label="Username"
          name="username"
          placeholder="Enter Username"
          autoComplete="off"
          size="lg"
        />

        <TextField
          label="Password"
          type="password"
          name="password"
          placeholder="Enter Password"
          autoComplete="off"
          size="lg"
        />

        <ButtonGroup pt={"1rem"}>
          <Button colorScheme="teal" type="submit">
            Log In
          </Button>
          <Button onClick={() => navigate("/sign-up")}>Create Account</Button>
        </ButtonGroup>
      </VStack>
    </Formik>
  );
};

export default Login;
