import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Container, Button, Form, FormGroup, Input } from "reactstrap";
import Image from "../resources/login_background.jpg";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  authenticate = () => {
    const url = this.props.url;
    const payload = {
      username: this.state.username,
      password: this.state.password
    };

    axios(url, {
      method: "post",
      data: payload,
      withCredentials: true
    })
      .then(res => {
        if (res.status === 200) {
          console.log("Login successfull");
          this.props.history.push("/orders");
        } else {
          alert("username password do not match");
        }
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status === 401) {
            console.log("Username password do not match");
            alert("username password do not match");
          } else if (err.response.status === 400) {
            console.log("please enter necassary fields");
            alert("Please fill the necassary fields");
          }
        } else {
          alert("Make sure the server is running");
        }
      });
  };

  render() {
    return (
      <div
        style={{
          backgroundImage: `url(${Image})`,
          backgroundSize: "cover",
          height: "100%",
          position: "absolute",
          width: "100%"
        }}
      >
        <Container
          style={{
            marginTop: 200
          }}
        >
          <Form
            className="bg-white m-5"
            title="Login"
            style={{
              padding: 10
            }}
          >
            <h1>Login</h1>
            <FormGroup>
              <Input
                name="username"
                id="username"
                placeholder="username"
                onChange={event =>
                  this.setState({ username: event.target.value })
                }
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                name="email"
                id="exampleEmail"
                placeholder="password"
                onChange={event =>
                  this.setState({ password: event.target.value })
                }
              />
            </FormGroup>
            <Button
              color="primary"
              size="lg"
              onClick={event => this.authenticate(event)}
              margin="15px"
            >
              Login
            </Button>
          </Form>
          <br />
        </Container>
      </div>
    );
  }
}

export default withRouter(Login);
