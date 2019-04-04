import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import axios from "axios";
import { ListItem } from "@material-ui/core";

import { Row, ListGroupItem, Col, Badge } from "reactstrap";

class showItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.item.item._id,
      name: this.props.item.item.name,
      price: this.props.item.item.price,
      orderId: this.props.orderId
    };
  }

  //update the item state when props update
  componentDidUpdate(prevProps) {
    if (this.props.item.item._id !== prevProps.item.item._id) {
      this.setState({
        id: this.props.item.item._id,
        name: this.props.item.item.name,
        price: this.props.item.item.price
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
          this.setState({ added: true });
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
    let ListItem;
    if (this.props.item.added) {
      ListItem = (
        <ListGroupItem
          name={this.state.name}
          style={{
            backgroundColor: "#eee"
          }}
          disabled
          onClick={this.addItems}
        >
          <Row>
            <Col>
              <h1>{this.state.name} </h1>
            </Col>

            <Col className  ="d-flex align-items-center">
              Unit Price:${this.state.price}
            </Col>
          </Row>
        </ListGroupItem>
      );
    } else {
      ListItem = (
        <ListGroupItem
          name={this.state.name}
          style={{
            backgroundColor: "#eee"
          }}
          onClick={this.addItems}
        >
          <Row>
            <Col>
              <h1>{this.state.name} </h1>
            </Col>
            <Col className="d-flex align-items-center">
              Unit Price:$<Badge color="danger">{this.state.price}</Badge>
            </Col>
          </Row>
        </ListGroupItem>
      );
    }

    return <div>{ListItem}</div>;
  }
}

export default showItems;
