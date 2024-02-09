import axios from "axios";
import PropTypes from "prop-types";
import { createContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AccountContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState({ loggedIn: null });
  const navigate = useNavigate();

  const userContextMemo = useMemo(() => ({ user, setUser }), [user]);

  useEffect(() => {
    axios
      .get("/api/auth/isLoggedIn")
      .then(({ data }) => {
        if (data.loggedIn) {
          setUser({ ...data });
          navigate("/home");
        } else {
          setUser({ loggedIn: false });
        }
      })
      .catch(() => setUser({ loggedIn: false }));
  }, [navigate]);

  return (
    <AccountContext.Provider value={userContextMemo}>
      {children}
    </AccountContext.Provider>
  );
};

UserContext.propTypes = {
  children: PropTypes.node,
};

export default UserContext;
