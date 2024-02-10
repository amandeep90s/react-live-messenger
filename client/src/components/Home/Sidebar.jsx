import { useDisclosure } from "@chakra-ui/hooks";
import { ChatIcon } from "@chakra-ui/icons";
import {
  Button,
  Circle,
  Divider,
  HStack,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Tab, TabList } from "@chakra-ui/tabs";
import { useContext } from "react";
import { AccountContext } from "../AccountContext";
import AddFriendModal from "./AddFriendModal";
import { FriendContext } from "./Home";

const Sidebar = () => {
  const { friendList } = useContext(FriendContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setUser } = useContext(AccountContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser({
      loggedIn: null,
      token: null,
      username: null,
    });
  };

  return (
    <>
      <VStack py="1.4rem" justifyContent="space-between" h="100vh">
        <VStack w="100%">
          <HStack justify="space-evenly">
            <Heading size="md">Add Friend</Heading>
            <Button onClick={onOpen}>
              <ChatIcon />
            </Button>
          </HStack>
          <Divider />

          <VStack as={TabList}>
            {friendList.map((friend) => (
              <HStack as={Tab} key={`friend:${friend.username}`}>
                <Circle
                  bg={friend.connected ? "green.500" : "red.500"}
                  w="20px"
                  h="20px"
                />
                <Text>{friend.username}</Text>
              </HStack>
            ))}
          </VStack>
        </VStack>
        <HStack pl="1.4rem" justify="start" w="100%">
          <Button onClick={handleLogout}>Log Out</Button>

          <Text>Sign in as {`${user?.username}`}</Text>
        </HStack>
      </VStack>

      <AddFriendModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Sidebar;
