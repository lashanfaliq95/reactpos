import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { TextField, RaisedButton, AppBar } from "material-ui";
import axios from "axios";
import { withRouter } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  authenticate = event => {
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
        console.log(res);
        if (res.status === 200) {
          console.log("Login successfull");
          this.props.history.push("/orders");
        } else {
          console.log("User not found");
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
      <MuiThemeProvider>
        <div>
          <AppBar title="Login" />
          <TextField
            m={100}
            hintText="Enter your Username"
            floatingLabelText="Username"
            onChange={(event, newValue) =>
              this.setState({ username: newValue })
            }
          />
          <br />
          <TextField
            type="password"
            hintText="Enter your Password"
            floatingLabelText="Password"
            onChange={(event, newValue) =>
              this.setState({ password: newValue })
            }
          />{" "}
          <br />
          <RaisedButton
            label="Login"
            primary={true}
            style={style}
            onClick={event => this.authenticate(event)}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}
const style = {
  margin: 15
};

export default withRouter(Login);
