import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";

const ManagerLoginModal = (props) => {
  /**************** COMPONENT STATES ******************** */

  const [modal, setModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**************** MODAL TOGGLER ******************** */

  const handleToggle = useCallback(() => {
    // Clear errors
    setError(null);
    setModal(!modal);
  }, [modal]);

  /**************** STATE HANDLERS ******************** */

  const handleChangeUsername = (e) => setUsername(e.target.value);
  const handleChangePassword = (e) => setPassword(e.target.value);

  /**************** FORM SUBMISSION ******************** */

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMsg("Please enter username and password");
    } else {
      // Headers
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Request body
      const body = JSON.stringify({ username, password });

      /**************** REQUEST SUBMISSION ******************** */
      axios
        .post("/login_manager", body, config)
        .then((res) => {
          console.log(res);
          console.log(res.data);
          setIsAuthenticated(true);
          props.handleSuccessfulAuth(res.data, username);
        })
        .catch((err) => {
          console.log("\nLogin Error : ");
          console.log(err);
          console.log("\nError Response: ");
          console.log(err.response.data);
          setError("LOGIN_FAIL");
          setMsg(err.response.data);
        });
    }
  };

  /**************** RENDER AND RERENDER ******************** */

  useEffect(() => {
    // Check for register error
    if (!(error === "LOGIN_FAIL")) {
      setMsg(null);
    }

    // If authenticated, close modal
    if (modal) {
      if (isAuthenticated) {
        handleToggle();
      }
    }
  }, [error, handleToggle, isAuthenticated, modal]);

  /************************** RENDER ************************ */
  return (
    <div>
      <Button onClick={handleToggle} className="mt-4 mb-3" color="dark" block>
        <h1>Manager Login</h1>
      </Button>

      <Modal isOpen={modal} toggle={handleToggle}>
        <ModalHeader toggle={handleToggle}>Manager Login</ModalHeader>
        <ModalBody>
          {msg ? <Alert color="danger">{msg}</Alert> : null}
          <Form>
            <FormGroup>
              <Label for="email">Username</Label>
              <Input
                type="username"
                name="username"
                id="usename"
                placeholder="username"
                className="mb-3"
                onChange={handleChangeUsername}
              />

              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                className="mb-3"
                onChange={handleChangePassword}
              />

              <Button
                color="dark"
                style={{ marginTop: "2rem" }}
                block
                onClick={handleOnSubmit}
              >
                Login
              </Button>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ManagerLoginModal;
