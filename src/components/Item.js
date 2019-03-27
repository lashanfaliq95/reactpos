import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import TextField from "material-ui/TextField";
import axios from "axios";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  TableBody,
  TableRow,
  TableCell,
  Table,
  Fab,
  ListItem
} from "@material-ui/core";
import { withRouter } from "react-router-dom";

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.item.item._id,
      name: this.props.item.item.name,
      price: this.props.item.item.price,
      qtyonstock: this.props.item.item.qtyonstock,
      orderamount: this.props.item.orderamount,
      totalPrice: this.props.item.item.price * this.props.item.orderamount,
      items: this.props.items
    };
  }

  containsItem = (itemid, list) => {
    let i;
    for (i = 0; i < list.length; i++) {
      if (itemid === list[i].item._id) {
        return i;
      }
    }
    return -1;
  };

  //update the item state when props update
  componentDidUpdate(prevProps) {
    if (this.props.item.item._id !== prevProps.item.item._id) {
      this.setState({
        id: this.props.item.item._id,
        name: this.props.item.item.name,
        price: this.props.item.item.price,
        qtyonstock: this.props.item.item.qtyonstock,
        orderamount: this.props.item.orderamount,
        totalPrice: this.props.item.item.price * this.props.item.orderamount
      });
    }
    if (this.props.items !== prevProps.items) {
      this.setState({
        items: this.props.items
      });
    }
  }

  toggleHover = () => {
    this.setState({ hover: !this.state.hover });
  };

  styles = theme => ({
    fab: {
      margin: theme.spacing.unit
    },
    extendedIcon: {
      marginRight: theme.spacing.unit
    }
  });

  //update item quantity
  updateItem = number => {
    const newNum = number - this.state.orderamount;
    this.updateItems(newNum);
  };

  updateItems = num => {
    const updateurl = this.props.updateurl + "/" + this.state.id;
    axios(updateurl, {
      method: "put",
      withCredentials: true,
      data: { value: num }
    })
      .then(res => {
        if (res.status === 200) {
          //update the total price in the parent component
          this.props.updatePrice(num * parseInt(this.state.price));

          this.setState({
            orderamount: res.data.orderamount,
            qtyonstock: res.data.qtyonstock,
            totalPrice:
              parseInt(res.data.orderamount) * parseInt(this.state.price)
          });

          //update the the item from the items array
          const index = this.containsItem(this.state.id, this.state.items);
          const newItems = [...this.state.items];
          newItems[index].item.qtyonstock = this.state.qtyonstock;
          newItems[index].orderamount = this.state.orderamount;

          //pass the updated items array to the parent component
          this.props.handler(newItems);
          this.setState({ items: newItems });
        }
      })
      .catch(err => {
        if (err.status === 401) {
          alert("Session has timedout please login again ");
          this.props.history.push("/login");
        }
        console.log(err);
      });
  };

  deleteItem = () => {
    const deleteUrl = this.props.deleteurl + "/" + this.state.id;
    axios(deleteUrl, {
      method: "put",
      withCredentials: true
    })
      .then(res => {
        if (res.status === 200) {
          console.log("Item has been deleted succesfully");
          //remove the deleted item from the items array
          const newItems = this.props.items.filter(
            item => res.data._id !== item.item._id
          );

          //update the total price of the parent component
          const priceToDeduct = -(this.state.price * this.state.orderamount);
          this.props.updatePrice(priceToDeduct);

          //update the items array of parent component
          this.props.handler(newItems);
        }
      })
      .catch(err => {
        if (err.status === 401) {
          alert("Session has timedout please login again ");
          this.props.history.push("/login");
        }
        console.log(err);
      });
  };

  render() {
    var linkStyle;
    if (this.state.hover) {
      linkStyle = {
        backgroundColor: "#ddd",
        margin: 15,
        padding: 20,
        cursor: "pointer"
      };
    } else {
      linkStyle = {
        backgroundColor: "#eee",
        margin: 15,
        padding: 20,
        cursor: "pointer"
      };
    }
    return (
      <div>
        <MuiThemeProvider>
          <ListItem
            onMouseEnter={this.toggleHover}
            onMouseLeave={this.toggleHover}
            style={linkStyle}
          >
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <h1>{this.state.name}</h1>
                    <p>price {this.state.price}</p>
                    <p>orderamount {this.state.orderamount}</p>
                    <p>qtyonstock {this.state.qtyonstock}</p>
                  </TableCell>

                  <TableCell align="right">
                    <TextField
                      type="number"
                      name="orderAmount"
                      min={0}
                      max={this.state.orderamount + this.state.qtyonstock}
                      variant="outlined"
                      onChange={(event, newValue) => this.updateItem(newValue)}
                      inputStyle={{ backgroundColor: '#F6F5F5' }}
                    />
                    <p>Price : {this.state.totalPrice}</p>
                  </TableCell>

                  <TableCell align="right">
                 
                      <Fab
                        aria-label="Delete"
                        className={this.fab}
                        name="delBtn"
                        id="delItemBtn"
                        onClick={this.deleteItem}
                      >
                        <DeleteIcon />
                      </Fab>
                   
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </ListItem>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default withRouter(Item);
