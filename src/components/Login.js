import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { TextField, RaisedButton, AppBar } from "material-ui";
import axios from "axios";
import { withRouter } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,InputGroup, InputGroupAddon, InputGroupText
} from "reactstrap";
import { colors } from "material-ui/styles";

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
      // <Container>
      //   <Navbar
      //     light
      //     style={{
      //       backgroundColor: "#E16740",
      //       height: "auto",
      //       fontSize: 30,
      //       textAlign: "center",
      //       padding: 10
      //     }}
      //     expand="md"
      //   >
      //     <NavbarBrand
      //       style={{
      //         padding: 20
      //       }}
      //     >
      //       Login
      //     </NavbarBrand>
      //   </Navbar>
      //   <MuiThemeProvider>
      //     <Container style={{
      //       marginTop:200
      //     }}>
      //     <Form>
      //    <Col>
      //       <FormGroup>
      //         <Label>Email</Label>
      //         <Input
      //           type="email"
      //           name="email"
      //           id="exampleEmail"
      //           placeholder="myemail@email.com"
      //         />
      //       </FormGroup>
      //     </Col>
      //     </Form>
      // <br />
      //     <TextField
      //       type="password"
      //       hintText="Enter your Password"
      //       floatingLabelText="Password"
      //       onChange={(event, newValue) =>
      //         this.setState({ password: newValue })
      //       }
      //     />{" "}
      //     <br />
      //     {/* <Button
      //       label="Login"
      //       secondary={true}
      //       style={style}
           
      //     /> */}
      //     <Button color="primary" size="lg"
      //      onClick={event => this.authenticate(event)}
      //      margin="15px">Large Button</Button>
      //     </Container>
        
      //     </MuiThemeProvider>
      // </Container>
    );
  }
}
const style = {
  margin: 15,
  backgroundColor: "#E16740",
  size:"lg"
};

export default withRouter(Login);
