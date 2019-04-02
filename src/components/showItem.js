import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import axios from "axios";
import {
  ListItem
} from "@material-ui/core";

import {
  Row,
  Col} from "reactstrap";

class showItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.item._id,
      name: this.props.item.name,
      price: this.props.item.price,
      orderId: this.props.orderId
    };
  }

  //update the item state when props update
  componentDidUpdate(prevProps) {
    if (this.props.item._id !== prevProps.item._id) {
      this.setState({
        id: this.props.item._id,
        name: this.props.item.name,
        price: this.props.item.price
      });
    }
  }

  addItems = () => {
    const url =
      this.props.url +
      "orders/addorderitems/" +
      this.state.orderId +
      "/" +
      this.state.id;

    axios(url, {
      method: "put",
      withCredentials: true
    })
      .then(res => {
        if (res.status === 200) {
          console.log("Successfully added items to the order");
          this.props.handler(res.data.items);
          this.props.handlerAllItems(this.state.id);
        }
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status === 401) {
            alert("Session has timedout please login again ");
            this.props.history.push("/login");
          }
        }
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <ListItem
            name={this.state.name}
            style={{
              backgroundColor: "#eee",
              margin: 15,
              padding: 20
            }}
            onClick={this.addItems}
          >
            <Row>
              <Col>
                <h1>{this.state.name} </h1>
              </Col>
              <Col>
            
                <p>price {this.state.price}</p>
              </Col>
            </Row>
          </ListItem>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default showItems;
