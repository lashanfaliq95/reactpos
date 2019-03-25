import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import { Redirect } from 'react-router';
import { withRouter } from "react-router-dom";


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
  }

  authenticate = event => {
    const url = this.props.url;
    const payload = {
      "username": this.state.username,
      "password": this.state.password,
      "authenticated": false
    }



    axios(url, {
      method: "post",
      data: payload,
      withCredentials: true
    }).then(res => {
      console.log(res);
      if (res.status === 200) {
        console.log("Login successfull");
        this.props.history.push("/orders");
      }
      else if (res.status === 204) {
        console.log("Username password do not match");
        alert("username password do not match")
      }
      else {
        console.log("User not found");
        alert("username password do not match")
      }
    })
      .catch(err => {
        console.log(err);
      })

  }

  render() {
    console.log('log')

    return (
      <MuiThemeProvider>
        <div>
          <AppBar
            title="Login" >
           
            </AppBar>
            
          <TextField
            hintText="Enter your Username"
            floatingLabelText="Username"
            onChange={(event, newValue) => this.setState({ username: newValue })}
          />
          <br />
          <TextField
            type="password"
            hintText="Enter your Password"
            floatingLabelText="Password"
            onChange={(event, newValue) => this.setState({ password: newValue })}
          />
          <br />
          <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.authenticate(event)} />
        </div>
      </MuiThemeProvider>
    )
  }

}
const style = {
  margin: 15,
};

export default withRouter(Login);