import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./components/Login";
import Orders from "./components/Orders";
import OrderDetails from "./components/OrderDetails";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "http://localhost:3000/"
    };
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Route
            exact
            path="/(login|)"
            render={props => (
              <React.Fragment>
                <Login url={this.state.url + "users/authenticate"} />
              </React.Fragment>
            )}
          />
          <Route
            exact
            path="/orders"
            render={props => (
              <React.Fragment>
                <Orders url={this.state.url} />
              </React.Fragment>
            )}
          />
          <Route
            exact
            path="/orderDetails/:id"
            render={props => (
              <React.Fragment>
                <OrderDetails id={props} url={this.state.url} />
              </React.Fragment>
            )}
          />
        </div>
      </Router>
    );
  }
}

export default App;
