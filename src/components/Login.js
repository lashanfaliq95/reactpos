import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { TextField, RaisedButton, AppBar } from "material-ui";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Container, Row, Col,Button, Form, FormGroup, Label, Input, 
  FormText,  Navbar,
  NavbarToggler,
  NavbarBrand, } from 'reactstrap';
  import Image from '../resources/login_background.jpg'
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
console.log(payload)
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
      // <MuiThemeProvider>
      //   <div>
      //     <AppBar title="Login" />
      //     <TextField
      //       m={100}
      //       hintText="Enter your Username"
      //       floatingLabelText="Username"
      //       onChange={(event, newValue) =>
      //         this.setState({ username: newValue })
      //       }
      //     />
      //     <br />
      //     <TextField
      //       type="password"
      //       hintText="Enter your Password"
      //       floatingLabelText="Password"
      //       onChange={(event, newValue) =>
      //         this.setState({ password: newValue })
      //       }
      //     />{" "}
      //     <br />
      //     <RaisedButton
      //       label="Login"
      //       primary={true}
      //       style={style}
      //       onClick={event => this.authenticate(event)}
      //     />
      //   </div>
      // </MuiThemeProvider>
      <div 
      style={{
        backgroundImage: `url(${Image})`,
        backgroundSize: 'cover',
        height: '100%',
        position: 'absolute',
        width: '100%'
      }}>
    
  
        {/* <Navbar
          light
          className="d-flex justify-content-center"
          style={{
            backgroundColor: "#E16740",
            height: "auto",
            fontSize: 30,
            textAlign: "center",
            padding: 10
          
          }}
          expand="md"
        >
          <NavbarBrand
        className="text-white font-weight-bold"
          >
            Login
          </NavbarBrand>
        </Navbar> */}
        <MuiThemeProvider>
          <Container style={{
            marginTop:200
          }}>
          <Form className="bg-white m-5"
          title="Login"
          style={{
            padding:10
          }}>
       <h1>Login</h1>
            <FormGroup>

              <Input
                name="username"
                id="username"
                placeholder="username"
                onChange={(event, newValue) =>
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
                onChange={(event, newValue) =>
                  this.setState({ password: event.target.value })
                         }
              />
            </FormGroup>
            <Button color="primary" size="lg"
           onClick={event => this.authenticate(event)}
           margin="15px">Login</Button>
          
          </Form>
      <br />
         
          </Container>
        
          </MuiThemeProvider>
    
      </div>
    );
  }
}


export default withRouter(Login);
