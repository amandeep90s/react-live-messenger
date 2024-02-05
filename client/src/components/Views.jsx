import { Text } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import NotFound from "./NotFound";
import PrivateRoutes from "./PrivateRoutes";

const Views = () => {
  return (
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
