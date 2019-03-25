import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import BottomNav from 'material-ui/BottomNavigation';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import List from 'material-ui/List';
import axios from 'axios';
import Order from './Order'
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { Button } from '@material-ui/core';
import Logout from './logout';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { withRouter } from "react-router-dom";

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: []
    }
  }

  getOrders = url => {
    axios.get(url, { withCredentials: true })
      .then(res => {
        this.setState({ orders: res.data });
        if (res.status === 200) {
          console.log("Got orders")
        }
        else {
          console.log("orders not found");

        }
      })
      .catch(err => {
        console.log(err);
      })

  }

  componentDidMount() {
    const url = this.props.url;

    this.getOrders(url);
  }

  logout = () => {
    axios('http://localhost:3000/users/logout', {
      method: "post",
      withCredentials: true
    })
      .then(res => {

        if (res.status === 200) {
          this.props.history.push("/login");
        }

      })
      .catch(err => {
        console.log(err);
      })
  }


  render() {
    console.log(this.state.orders);
    return (

      <MuiThemeProvider>
        <div>
          <AppBar
            title="Orders" >
            <IconButton color="inherit" aria-label="Logout" onClick={this.logout}>

              <AccountCircle />

            </IconButton>
          </AppBar>
          <List>
            {this.state.orders.map(order => (
              <Order order={order} />
            ))}


          </List>

        </div>
      </MuiThemeProvider>

    )
  }
}

export default withRouter(Orders);