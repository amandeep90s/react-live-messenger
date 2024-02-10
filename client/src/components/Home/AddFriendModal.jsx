import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/modal";
import { Button, Heading, ModalOverlay } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import PropTypes from "prop-types";
import { useCallback, useContext, useState } from "react";
import * as Yup from "yup";
import TextField from "../TextField";
import { FriendContext, SocketContext } from "./Home";

const AddFriendModal = ({ isOpen, onClose }) => {
  const [error, setError] = useState("");
  const { setFriendList } = useContext(FriendContext);
  const { socket } = useContext(SocketContext);

  const closeModal = useCallback(() => {
    setError("");
    onClose();
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a friend</ModalHeader>
        <ModalCloseButton></ModalCloseButton>
        <Formik
          initialValues={{ friendName: "" }}
          validationSchema={Yup.object({
            friendName: Yup.string()
              .required("Username is required")
              .min(6, "Username too short")
              .max(28, "Username too long"),
          })}
          onSubmit={(values) => {
            socket.emit(
              "add_friend",
              values.friendName,
              ({ errorMsg, done, newFriend }) => {
                if (done) {
                  setFriendList((prev) => [newFriend, ...prev]);
                  closeModal();
                  return;
                }
                setError(errorMsg);
              }
            );
          }}
        >
          <Form>
            <ModalBody>
              {error && (
                <Heading
                  as="p"
                  color="red.500"
                  fontSize="md"
                  textAlign="center"
                >
                  {error}
                </Heading>
              )}
              <TextField
                name="friendName"
                label="Friend's name"
                placeholder="Enter friend's username.."
                autoComplete="off"
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" type="submit">
                Submit
              </Button>
            </ModalFooter>
          </Form>
        </Formik>
      </ModalContent>
    </Modal>
  );
};

AddFriendModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AddFriendModal;
