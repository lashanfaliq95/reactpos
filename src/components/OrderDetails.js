import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { List, AppBar } from "material-ui";
import axios from "axios";
import { SettingsBackupRestore, AccountCircle } from "@material-ui/icons";
import Item from "./Item";
import ShowItem from "./showItem";
import { withRouter } from "react-router-dom";
import { Toolbar, IconButton } from "@material-ui/core";
import { Container } from "reactstrap";
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Badge,
  Popover,
  PopoverHeader,
  PopoverBody
} from "reactstrap";

class OrderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id.match.params.id,
      items: [],
      itemToAdd: "",
      totalPrice: 0,
      allItems: [],
      popoverOpen: false
    };
  }

  //to open the popover to logout
  toggle = () => {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  };

  getAllItems = () => {
    axios
      .get("http://localhost:3000/items/getallitems", { withCredentials: true })
      .then(res => {
       const allItems = res.data.filter(
          item => this.containsItem(item._id, this.state.items) === -1
        );
        let allItemsNew = [];

        //find which items are already in order
        res.data.map(item => {
          let added = false;
          this.state.items.map(addedItem => {
            if (item._id === addedItem.item._id) {
              added = true;
            }
          });
          allItemsNew.push({ item: item, added: added });
        });

        this.setState({
          allItems: allItemsNew
        });

        if (res.status === 200) {
          console.log("Succesfully received items");
        } else {
          console.log("Items not found");
        }
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status === 401) {
            alert("Session has timed out, please login again ");
            this.props.history.push("/login");
          }
        }
        console.log(err);
      });
  };

  getItems = url => {
    axios
      .get(url, { withCredentials: true })
      .then(res => {
        this.setState({
          items: res.data.items,
          totalPrice: this.getPrice(res.data.items)
        });

        if (res.status === 200) {
          console.log("Succesfully received items");
        } else {
          console.log("Items not found");
        }
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status === 401) {
            alert("Session has timed out, please login again ");
            this.props.history.push("/login");
          }
        }
        console.log(err);
      });
  };

  //function to get the total price of a given item list
  getPrice = items => {
    let i,
      sum = 0,
      price;
    for (i = 0; i < items.length; i++) {
      price = parseInt(items[i].item.price) * parseInt(items[i].orderamount);
      sum += price;
    }
    return sum;
  };

  updateItem = item => {
    this.setState({ itemToAdd: item });
  };

  logout = () => {
    axios("http://localhost:3000/users/logout", {
      method: "post",
      withCredentials: true
    })
      .then(res => {
        if (res.status === 200) {
          this.props.history.push("/login");
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

  //function to update items when a state change occur in an child item
  handler = newItems => {
    this.setState({ items: newItems });
  };

  handlerAllItems = itemId => {
    //remove the item added to items from all items
    const allItems = this.state.allItems.map(item => {
      if (itemId === item.item._id) {
        item.added = true;
      }
      return item;
    });
    this.setState({ allItems: allItems });
  };

  pushAllItems = itemId => {
    const allItems = this.state.allItems.map(item => {
      if (itemId === item.item._id) {
        item.added = false;
      }
      return item;
    });
    this.setState({ allItems: allItems });
  };
  //function to update total price when a state change occur in an child item
  updatePrice = newExcess => {
    const price = this.state.totalPrice + newExcess;
    this.setState({ totalPrice: price });
  };

  containsItem = (itemid, list) => {
    let i;
    for (i = 0; i < list.length; i++) {
      if (itemid === list[i].item._id) {
        return i;
      }
    }
    return -1;
  };
  containsAllItem = (itemid, list) => {
    let i;
    for (i = 0; i < list.length; i++) {
      if (itemid === list[i]._id) {
        return i;
      }
    }
    return -1;
  };

  //when the component mounts load the items
  async componentDidMount() {
    const url = this.props.url + "orders/getorder/" + this.state.id;
    await this.getItems(url);
    await this.getAllItems();
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
              <PopoverHeader onClick={this.logout}>Logout</PopoverHeader>
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
                {this.state.items.map((item, i) => (
                  <Item
                    key={i}
                    updateurl={
                      this.props.url +
                      "orders/updateorderitems/" +
                      this.state.id
                    }
                    deleteurl={
                      this.props.url +
                      "orders/removeorderitems/" +
                      this.state.id
                    }
                    handler={this.handler}
                    item={item}
                    items={this.state.items}
                    updatePrice={this.updatePrice}
                    handlerAllItems={this.pushAllItems}
                  />
                ))}
              </ListGroup>
              <Badge color="primary">
                {" "}
                <h1>Total Price : ${this.state.totalPrice} </h1>
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
              {this.state.allItems.map((item, i) => (
                <ShowItem
                  key={i}
                  item={item}
                  orderId={this.state.id}
                  handler={this.handler}
                  url={this.props.url}
                  handlerAllItems={this.handlerAllItems}
                />
              ))}
            </ListGroup>
          </Container>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(OrderDetails);
