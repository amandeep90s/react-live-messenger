import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AccountContext } from "./AccountContext";

const useAuth = () => {
  const { user } = useContext(AccountContext);
  return user?.loggedIn;
};

const PrivateRoutes = () => {
  const isAuth = useAuth();

  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
