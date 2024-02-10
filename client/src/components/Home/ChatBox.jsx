import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { HStack } from "@chakra-ui/layout";
import { Field, Form, Formik } from "formik";
import PropTypes from "prop-types";
import { useContext } from "react";
import * as Yup from "yup";
import { MessagesContext, SocketContext } from "./Home";

const ChatBox = ({ userid }) => {
  const { setMessages } = useContext(MessagesContext);
  const { socket } = useContext(SocketContext);

  return (
    <Formik
      initialValues={{ message: "" }}
      validationSchema={Yup.object({
        message: Yup.string().required("Username is required").min(1).max(255),
      })}
      onSubmit={(values, actions) => {
        const message = { to: userid, from: null, content: values.message };
        socket.emit("dm", message);
        setMessages((prevMsgs) => [message, ...prevMsgs]);
        actions.resetForm();
      }}
    >
      <HStack as={Form} w="100%" pb="1.4rem" px="1.4rem">
        <Input
          as={Field}
          name="message"
          placeholder="Type message here.."
          size="lg"
          autoComplete="off"
        />
        <Button type="submit" size="lg" colorScheme="teal">
          Send
        </Button>
      </HStack>
    </Formik>
  );
};

ChatBox.propTypes = {
  userid: PropTypes.string,
};

export default ChatBox;
