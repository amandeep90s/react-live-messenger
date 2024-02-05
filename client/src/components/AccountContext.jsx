import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const AccountContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState({ loggedIn: null });

  return (
    <AccountContext.Provider value={{ user, setUser }}>
      {children}
    </AccountContext.Provider>
  );
};

UserContext.propTypes = {
  children: PropTypes.node,
};

export default UserContext;
