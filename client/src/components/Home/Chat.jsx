import { Text, VStack } from "@chakra-ui/react";
import { TabPanel, TabPanels } from "@chakra-ui/tabs";
import PropTypes from "prop-types";
import { useContext, useEffect, useRef } from "react";
import ChatBox from "./ChatBox";
import { FriendContext, MessagesContext } from "./Home";

const Chat = ({ userid }) => {
  const { friendList } = useContext(FriendContext);
  const { messages } = useContext(MessagesContext);
  const bottomDiv = useRef();

  useEffect(() => {
    bottomDiv.current?.scrollIntoView();
  });

  return friendList.length > 0 ? (
    <VStack h="100%" justify="end">
      <TabPanels overflowY="scroll">
        {friendList.map((friend) => (
          <VStack
            key={`chat:${friend.username}`}
            as={TabPanel}
            flexDir="column-reverse"
            w="100%"
          >
            <div ref={bottomDiv} />
            {messages
              .filter(
                (message) =>
                  message.to === friend.userid || message.from === friend.userid
              )
              .map((message, index) => (
                <Text
                  key={`msg:${friend.username}-${index}`}
                  m={
                    message.to === friend.userid
                      ? "1rem 0 0 auto !important"
                      : "1rem auto 0 0 !important"
                  }
                  maxW="50%"
                  bg={message.to === friend.userid ? "blue.100" : "gray.100"}
                  color="gray.800"
                  borderRadius="10px"
                  p="0.5rem 1rem"
                  fontSize="lg"
                >
                  {message.content}
                </Text>
              ))}
          </VStack>
        ))}
      </TabPanels>
      <ChatBox userid={userid} />
    </VStack>
  ) : (
    <VStack
      justify="center"
      pt="5rem"
      w="100%"
      textAlign="center"
      fontSize="lg"
    >
      <TabPanels>
        <Text>No friend :( Click add friend to start chatting</Text>
      </TabPanels>
    </VStack>
  );
};

Chat.propTypes = {
  userid: PropTypes.string,
};

export default Chat;
