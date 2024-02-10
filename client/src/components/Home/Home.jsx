import { Grid, GridItem, Tabs } from "@chakra-ui/react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import socketConnection from "../../socket";
import { AccountContext } from "../AccountContext";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import useSocketSetup from "./useSocketSetup";

export const FriendContext = createContext();
export const MessagesContext = createContext();
export const SocketContext = createContext();

const Home = () => {
  const [friendList, setFriendList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [friendIndex, setFriendIndex] = useState(0);

  const { user } = useContext(AccountContext);
  const [socket, setSocket] = useState(() => socketConnection(user));

  useEffect(() => {
    setSocket(() => socketConnection(user));
  }, [user]);

  const friendListContextValue = useMemo(
    () => ({ friendList, setFriendList, messages, setMessages }),
    [friendList, messages]
  );

  const messagesContextValue = useMemo(
    () => ({ messages, setMessages }),
    [messages]
  );

  const socketContextValue = useMemo(() => ({ socket }), [socket]);

  useSocketSetup(setFriendList, setMessages, socket);

  return (
    <FriendContext.Provider value={friendListContextValue}>
      <SocketContext.Provider value={socketContextValue}>
        <Grid
          templateColumns="repeat(10, 1fr)"
          h="100vh"
          as={Tabs}
          onChange={(index) => setFriendIndex(index)}
        >
          <GridItem colSpan={3} borderRight="1px solid gray">
            <Sidebar />
          </GridItem>
          <GridItem colSpan={7} maxH="100vh">
            <MessagesContext.Provider value={messagesContextValue}>
              <Chat userid={friendList[friendIndex]?.userid} />
            </MessagesContext.Provider>
          </GridItem>
        </Grid>
      </SocketContext.Provider>
    </FriendContext.Provider>
  );
};

export default Home;
