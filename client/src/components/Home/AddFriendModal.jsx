import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/modal";
import { Button, ModalOverlay } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import PropTypes from "prop-types";
import * as Yup from "yup";
import TextField from "../TextField";

const AddFriendModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
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
          onSubmit={(values, actions) => {
            console.log(values);
            onClose();
            actions.resetForm();
          }}
        >
          <Form>
            <ModalBody>
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
