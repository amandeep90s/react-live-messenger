import { Button, ButtonGroup, Heading, VStack } from "@chakra-ui/react";
import axios from "axios";
import { Form, Formik } from "formik";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { AccountContext } from "../AccountContext";
import TextField from "./TextField";

const Login = () => {
  const { setUser } = useContext(AccountContext);
  const navigate = useNavigate();

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

        axios
          .post("/api/auth/login", { ...values })
          .then(({ data }) => {
            if (data.loggedIn) {
              setUser({ ...data });
              navigate("/home");
            }
          })
          .catch((error) => console.log(error));
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