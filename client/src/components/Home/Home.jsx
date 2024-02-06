import { Grid, GridItem, Tabs } from "@chakra-ui/react";
import { createContext, useMemo, useState } from "react";
import Chat from "./Chat";
import Sidebar from "./Sidebar";

export const FriendContext = createContext();

const Home = () => {
  const [friendList, setFriendList] = useState([
    { username: "aman", connected: true },
    { username: "gaman", connected: false },
  ]);

  const contextValue = useMemo(
    () => ({ friendList, setFriendList }),
    [friendList]
  );

  return (
    <FriendContext.Provider value={contextValue}>
      <Grid templateColumns="repeat(10, 1fr)" h="100vh" as={Tabs}>
        <GridItem colSpan={3} borderRight="1px solid gray">
          <Sidebar />
        </GridItem>
        <GridItem colSpan={7}>
          <Chat />
        </GridItem>
      </Grid>
    </FriendContext.Provider>
  );
};

export default Home;
