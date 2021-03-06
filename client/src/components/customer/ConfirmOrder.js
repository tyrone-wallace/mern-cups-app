import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Audio from "../../assets/audio.png";
import Icon from "../../assets/icon.png";
import Photo from "../../assets/photo.png";
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
  Card,
  CardImg,
  ModalFooter,
} from "reactstrap";
import { Link } from "react-router-dom";

/********************** COMPONENT ********************** */
const ConfirmOrder = (props) => {
  /**************** COMPONENT STATES ******************** */

  const [modal, setModal] = useState(false);
  const [nestedModal, setNestedModal] = useState(false);
  const [nestedPassword, setNestedPassword] = useState(false);
  const [nestedImage, setNestedImage] = useState(false);
  const [nestedAudio, setNestedAudio] = useState(false);
  const [email_address, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState("");
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  var [attempts, setAttempts] = useState(0);
  const [success, setSuccess] = useState("");

  /**************** MODALYou have 3 attempts to confirm TOGGLERS ******************** */

  // Main Toggle
  const handleToggle = useCallback(() => {
    // Clear errors
    setError(null);
    // Revert modal state
    setModal(!modal);
  }, [modal]);

  // Secondary Toggle
  const toggleNested = () => {
    setNestedModal(!nestedModal);
  };

  // Ternary Toggle
  const togglePassword = () => {
    setNestedPassword(!nestedPassword);
  };

  // Ternary Toggle
  const toggleImage = () => {
    setNestedImage(!nestedImage);
  };

  // Ternary Toggle
  const toggleAudio = () => {
    setNestedAudio(!nestedAudio);
  };

  /**************** STATE HANDLERS ******************** */

  const handleChangeEmailAddress = (e) => setEmailAddress(e.target.value);
  const handleChangePassword = (e) => setPassword(e.target.value);

  const handleChangeFile = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  /**************** ORDER SUBMISSION ******************** */

  const sendOrder = (balance) => {
    var tempName = [];
    var tempAmt = [];
    var tempItemCost = [];

    let size = props.order.length;
    for (let i = 0; i < size; i++) {
      tempName.push(props.order[i].name);
      tempAmt.push(props.order[i].quantity);
      tempItemCost.push(props.order[i].cost);
    }

    console.log("ITEM ARRAY: ID", tempName);
    console.log("ITEM ARRAY: AMT", tempAmt);
    console.log("ITEM ARRAY: UNIT COST", tempItemCost);

    // Request body
    const body = {
      item_names: tempName,
      amount_sold: tempAmt,
      item_costs: tempItemCost,
      account_balance: balance,
      email_address,
    };

    console.log(body);

    /**************** CONFIRMATION SUBMISSION ******************** */
    axios({
      method: "POST",
      url: "/confirm_order",
      encType: "multipart/form-data",
      data: body,
    })
      .then((res) => {
        console.log(res);
        console.log(res.data);
        setSuccess("YES");
      })
      .catch((err) => {
        console.log("Error", err);
        console.log("Error Response", err.response);
      });
  };

  /**************** FORM SUBMISSION ******************** */

  const handleOnSubmit = (e) => {
    e.preventDefault();

    // Check for empty fields
    if (!email_address || !(file || password)) {
      setMsg("Please enter email and digital id.");
    } else {
      // Request body
      const formData = new FormData();
      formData.append("email_address", email_address);
      formData.append("password", password);
      formData.append("file", file);
      console.log(formData);

      /**************** REQUEST SUBMISSION ******************** */
      axios({
        method: "POST",
        url: "/login_customer",
        encType: "multipart/form-data",
        data: formData,
      })
        .then((res) => {
          console.log(res);
          console.log(res.data);
          setIsAuthenticated(true);
          sendOrder(res.data.account_balance);
        })
        .catch((err) => {
          console.log("Error", err);
          console.log("Error Response", err.response);
          console.log("\nStatus Response", err.response.status);
          setError("LOGIN_FAIL");
          setMsg(err.response.data);
          setAttempts(attempts++);
          console.log(attempts);
        });
    }
  };

  /**************** RENDER AND RERENDER ******************** */

  useEffect(() => {
    // Check for login error & clear message
    if (!(error === "LOGIN_FAIL")) {
      setMsg(null);
    }
    console.log("CONFIRMATION PROPS: ", props);

    // If authenticated, close modal
    if (modal) {
      if (isAuthenticated) {
        handleToggle();
      }
    }
  }, [error, handleToggle, isAuthenticated, modal, props]);

  const pass = props.loggedInStatus;

  /******************************* RENDER ******************************* */
  if (pass === "NOT_LOGGED_IN") {
    return (
      <div>
        <h1 style={{ textAlign: "center" }}>
          YOU ARE NOT LOGGED IN. PLEASE <Link to="/">LOGIN</Link>
        </h1>
      </div>
    );
  } else if (attempts === 1) {
    return (
      <div>
        <Alert color="danger" style={{ textAlign: "center" }}>
          You ONLY had 3 attempts. Order is cancelled
        </Alert>
      </div>
    );
  } else if (success === "YES") {
    return (
      <div>
        <Alert
          color="success"
          style={{ textAlign: "center", marginTop: "3rem" }}
        >
          ORDERED SUCCESSFULLY
        </Alert>
      </div>
    );
  } else {
    return (
      <div>
        <Alert color="primary" style={{ textAlign: "center" }}>
          You have 3 attempts to confirm
        </Alert>
        <Button
          onClick={handleToggle}
          className="mt-4 mb-3"
          color="success"
          block
        >
          CONFIRM ORDER
        </Button>
        {/* ***************** PRIMARY MODAL *********************** */}
        <Modal isOpen={modal} toggle={handleToggle}>
          {/* header */}
          <ModalHeader toggle={handleToggle}>Customer Login</ModalHeader>
          {/* body */}
          <ModalBody>
            {/* Error display */}
            {msg ? <Alert color="danger">{msg}</Alert> : null}
            <Form>
              <FormGroup>
                <Label for="email_address">Email Address</Label>
                <Input
                  type="email"
                  name="email_address"
                  id="email_address"
                  placeholder="Email Address"
                  className="mb-3"
                  onChange={handleChangeEmailAddress}
                />

                <Button
                  color="primary"
                  style={{ marginTop: "2rem" }}
                  block
                  onClick={toggleNested}
                >
                  Digital Identication
                </Button>

                {/* ***************** SECORDARY MODEL ********************** */}
                <Modal isOpen={nestedModal} toggle={toggleNested}>
                  {/* header */}
                  <ModalHeader>Digital Identication</ModalHeader>

                  <ModalBody>Please select any one</ModalBody>

                  <ModalBody>
                    <Button color="primary" onClick={togglePassword} block>
                      Password
                    </Button>

                    <Button color="primary" onClick={toggleImage} block>
                      Image
                    </Button>

                    <Button color="primary" onClick={toggleAudio} block>
                      Audio
                    </Button>
                  </ModalBody>

                  <ModalFooter>
                    <Button color="secondary" onClick={toggleNested}>
                      Done
                    </Button>
                  </ModalFooter>
                </Modal>

                {/************************ TERTIARY: PASSWORD MODAL********************* */}
                <Modal isOpen={nestedPassword} toggle={togglePassword}>
                  {/* header */}
                  <ModalHeader>Password</ModalHeader>

                  <ModalBody>
                    <Label for="digital_id">Password</Label>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Password"
                      className="mb-3"
                      onChange={handleChangePassword}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={togglePassword}>
                      Done
                    </Button>
                  </ModalFooter>
                </Modal>

                {/************************ TERTIARY: IMAGE MODAL********************* */}
                <Modal isOpen={nestedImage} toggle={toggleImage}>
                  {/* header */}
                  <ModalHeader>Image Selection</ModalHeader>
                  <ModalBody>
                    <Card>
                      <h3>Upload Photo</h3>
                      <CardImg src={Photo} alt={Icon} height="50%" />
                      <Input
                        name="file"
                        id="file"
                        type="file"
                        onChange={handleChangeFile}
                      />
                    </Card>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={toggleImage}>
                      Done
                    </Button>
                  </ModalFooter>
                </Modal>

                {/************************ TERTIARY: AUDIO MODAL ********************* */}
                <Modal isOpen={nestedAudio} toggle={toggleAudio}>
                  {/* header */}
                  <ModalHeader>Audio Recording</ModalHeader>

                  <ModalBody>
                    <Card>
                      <h3>Audio</h3>
                      <CardImg src={Audio} alt={Icon} height="50%" />
                      <Input
                        name="file"
                        id="file"
                        type="file"
                        onChange={handleChangeFile}
                      />
                      <audio
                        id="file"
                        name="file"
                        src={file}
                        controls="controls"
                      />
                    </Card>
                  </ModalBody>

                  <ModalFooter>
                    <Button color="primary" onClick={toggleAudio}>
                      Done
                    </Button>
                  </ModalFooter>
                </Modal>

                <Button
                  color="success"
                  style={{ marginTop: "2rem" }}
                  block
                  onClick={handleOnSubmit}
                >
                  CONFIRM
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
};

export default ConfirmOrder;
