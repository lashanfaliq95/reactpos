import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { AppBar, List } from "material-ui";
import axios from "axios";
import Order from "./Order";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { withRouter } from "react-router-dom";
import { Tab, Tabs, IconButton, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { Popover, PopoverHeader } from "reactstrap";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      tabNum: 0,
      popoverOpen: false
    };
  }

  //to open the popover to logout
  toggle = () => {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  };

  getOrders = url => {
    axios
      .get(url, { withCredentials: true })
      .then(res => {
        if (res.status === 200) {
          this.setState({ orders: res.data });
        }
      })
      .catch(err => {
        if (err.response.status === 401) {
          alert("Session has timedout please login again ");
          this.props.history.push("/login");
        }
        console.log(err);
      });
  };

  //change the status value of the given order
  updateOrders = (orderid, status) => {
    const updatedOrders = this.state.orders.map(order => {
      if (order._id === orderid) {
        order.status = status;
      }
      return order;
    });
    this.setState({ orders: updatedOrders });
  };

  logout = () => {
    const url = this.props.url + "users/logout";
    axios(url, {
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
      });
  };

  //fucntion to change tabs
  handleChange = (event, value) => {
    this.setState({ tabNum: value });
  };

  componentDidMount() {
    const url = this.props.url + "orders/getallorders";
    this.getOrders(url);
  }

  render() {
    const value = this.state.tabNum;
    return (
      <MuiThemeProvider>
        <div>
          <AppBar title="Orders">
            <Tabs value={value} onChange={this.handleChange}>
              <Tab label="Open Orders" />
              <Tab label="Closed Orders" />
            </Tabs>
            <IconButton color="inherit" aria-label="Logout" id="Popover1">
              <AccountCircle />
            </IconButton>
            <Popover
              placement="bottom"
              isOpen={this.state.popoverOpen}
              target="Popover1"
              toggle={this.toggle}
            >
              <PopoverHeader onClick={this.logout}>Logout</PopoverHeader>
            </Popover>
          </AppBar>

          {value === 0 && (
            <TabContainer>
              <List>
                {this.state.orders
                  .filter(order => order.status === "OPEN")
                  .map((order, i) => (
                    <Order
                      key={i}
                      order={order}
                      updateOrders={this.updateOrders}
                      url={this.props.url}
                    />
                  ))}
              </List>
            </TabContainer>
          )}
          {value === 1 && (
            <TabContainer>
              <List>
                {this.state.orders
                  .filter(order => order.status === "CLOSE")
                  .map((order, i) => (
                    <Order
                      key={i}
                      order={order}
                      updateOrders={this.updateOrders}
                      url={this.props.url}
                    />
                  ))}
              </List>
            </TabContainer>
          )}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(Orders);
