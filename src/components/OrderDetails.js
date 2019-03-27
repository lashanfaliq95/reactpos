import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { TextField, List, AppBar } from "material-ui";
import axios from "axios";
import { SettingsBackupRestore, AccountCircle, Add } from "@material-ui/icons";
import Item from "./Item";
import { withRouter } from "react-router-dom";
import { Toolbar, IconButton, Fab } from "@material-ui/core";

class OrderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id.match.params.id,
      items: [],
      itemToAdd: "",
      totalPrice: 0
    };
  }

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
        if (err.response.status === 401) {
          alert("Session has timed out, please login again ");
          this.props.history.push("/login");
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

  addItems = () => {
    const items = this.state.items;
    const itemId = this.state.itemToAdd;

    //check if the item has already been added to the order
    if (this.containsItem(itemId, items) === -1) {
      const url =
        this.props.url +
        "orders/addorderitems/" +
        this.state.id +
        "/" +
        this.state.itemToAdd;

      axios(url, {
        method: "put",
        withCredentials: true
      })
        .then(res => {
          if (res.status === 200) {
            console.log("Successfully added items to the order");
            this.setState({ items: res.data.items });
          }
        })
        .catch(err => {
          if (err.response.status === 401) {
            alert("Session has timedout please login again ");
            this.props.history.push("/login");
          }
          console.log(err);
        });
    } else {
      alert("Item already exists");
    }
  };

  //when the component mounts load the items
  componentDidMount() {
    const url = this.props.url + "orders/getorder/" + this.state.id;
    this.getItems(url);
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

            <IconButton
              color="inherit"
              aria-label="Logout"
              onClick={this.logout}
            >
              <AccountCircle />
            </IconButton>
          </AppBar>

          <List>
            {this.state.items.map((item, i) => (
              <Item
                key={i}
                updateurl={
                  this.props.url + "orders/updateorderitems/" + this.state.id
                }
                deleteurl={
                  this.props.url + "orders/removeorderitems/" + this.state.id
                }
                handler={this.handler}
                item={item}
                items={this.state.items}
                updatePrice={this.updatePrice}
              />
            ))}
          </List>

          <h1>TotalPrice{this.state.totalPrice}</h1>
          <TextField
            id="additem"
            onChange={(event, newValue) => this.updateItem(newValue)}
          />

          <Fab
            id="addItemBtn"
            onClick={this.addItems}
            color="primary"
            aria-label="Add"
            className={this.fab}
          >
            <Add />
          </Fab>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(OrderDetails);
