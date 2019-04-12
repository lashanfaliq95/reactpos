import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { AppBar } from "material-ui";
import { SettingsBackupRestore, AccountCircle } from "@material-ui/icons";
import Item from "./Item";
import ShowItem from "./showItem";
import { withRouter } from "react-router-dom";
import { Toolbar, IconButton } from "@material-ui/core";
import {
  ListGroup,
  Badge,
  Popover,
  PopoverHeader,
  Container
} from "reactstrap";
import { getOrderItems, deleteOrderItems } from "../actions/item-action";
import { logoutUserPOST, resetStore } from "../actions/user-actions";

import { connect } from "react-redux";

class OrderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      items: [],
      itemToAdd: "",
      totalPrice: 0,
      allItems: [],
      popoverOpen: false
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user.authenticate !== this.props.user.authenticate) {
      this.props.resetStore();
      this.props.history.push("/login");
    }
  }

  logoutUser = () => {
    this.props.onLogoutUser();
  };
  //to open the popover to logout
  toggle = () => {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  };

  //when the component mounts load the items
  async componentDidMount() {
    this.props.getItems(this.state.id);
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <AppBar title="Order View">
            <Toolbar />

            <IconButton
              color="inherit"
              aria-label="Logout"
              onClick={() => {
                this.props.deleteOrderItems();
                this.props.history.push("../orders");
              }}
            >
              <SettingsBackupRestore />
            </IconButton>

            <IconButton color="inherit" aria-label="Logout" id="Popover1">
              <AccountCircle />
            </IconButton>
            <Popover
              placement="bottom"
              isOpen={this.state.popoverOpen}
              target="Popover1"
              toggle={this.toggle}
            >
              <PopoverHeader onClick={this.logoutUser}>Logout</PopoverHeader>
            </Popover>
          </AppBar>
          <Container
            style={{
              position: "absolute",
              width: "70%"
            }}
          >
            <div>
              <ListGroup>
                {this.props.orderItems.map((item, i) => (
                  <Item key={i} orderId={this.state.id} item={item} />
                ))}
              </ListGroup>
              <Badge color="primary">
                {" "}
                <h1>Total Price : ${this.props.totalPrice} </h1>
              </Badge>
            </div>
          </Container>
          <Container
            style={{
              position: "absolute",
              width: "30%",
              marginLeft: "65%",
              padding: 20
            }}
          >
            <h1>Item List</h1>

            <ListGroup>
              {this.props.allItems.map((item, i) => (
                <ShowItem key={i} item={item} orderId={this.state.id} />
              ))}
            </ListGroup>
          </Container>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapActionsToProps = {
  getItems: getOrderItems,
  deleteOrderItems: deleteOrderItems,
  onLogoutUser: logoutUserPOST,
  resetStore: resetStore
};
const mapStateToProps = (state, props) => ({
  user: state.user,
  order: state.order,
  allItems: state.item.allItems,
  orderItems: state.item.orderItems,
  totalPrice: state.item.orderPrice,
  id: props.id.match.params.id
});

export default withRouter(
  connect(
    mapStateToProps,
    mapActionsToProps
  )(OrderDetails)
);
