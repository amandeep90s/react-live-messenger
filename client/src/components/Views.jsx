import { Text } from "@chakra-ui/react";
import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { AccountContext } from "./AccountContext";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import NotFound from "./NotFound";
import PrivateRoutes from "./PrivateRoutes";

const Views = () => {
  const { user } = useContext(AccountContext);

  return user.loggedIn === null ? (
    <Text>Loading...</Text>
  ) : (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/home" element={<Text>Hello home</Text>} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Views;
