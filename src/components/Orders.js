import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {AppBar,List} from 'material-ui';
import axios from 'axios';
import Order from './Order'
import AccountCircle from '@material-ui/icons/AccountCircle';
import { withRouter } from "react-router-dom";
import {Tab, Tabs,IconButton,Typography} from '@material-ui/core';
import PropTypes from 'prop-types';


function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};



class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      tabNum:0
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
        if(err.response.status===401){
          alert('Session has timedout please login again ');
          this.props.history.push("/login");
        }
        console.log(err);
      })

  }

  updateOrders=(orderid,status)=>{
  const updatedOrders=this.state.orders.map(
    (order)=>{
          if(order._id===orderid){
            order.status=status
          
          }
          return order;
    }
  )
  console.log(updatedOrders)

  this.setState({orders:updatedOrders})
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
        if(err.response.status===401){
          this.props.history.push("/login");
        }
        console.log(err);
      })
  }

  handleChange = (event, value) => {
    this.setState({ tabNum:value });
  };

  render() {
    console.log(this.state.orders);
    const value=this.state.tabNum;
    return (

      <MuiThemeProvider>
        <div>
          <AppBar
            title="Orders" >
              <Tabs value={value} onChange={this.handleChange}>
               <Tab label="Open Orders" />
              <Tab label="Closed Orders" />
            </Tabs>
            <IconButton color="inherit" aria-label="Logout" onClick={this.logout}>

              <AccountCircle />

            </IconButton>
          </AppBar>

          {value === 0 && <TabContainer>
            <List>
            {this.state.orders.filter(
              order=>order.status==='open'
             )
            .map(order => (
              <Order order={order} updateOrders={this.updateOrders}/>
            ))}


          </List>



          </TabContainer>}
        {value === 1 && <TabContainer>
        <List>
        {this.state.orders.filter(
              order=>order.status==='close'
             )
            .map(order => (
              <Order order={order} updateOrders={this.updateOrders} />
            ))}


          </List>
          </TabContainer>}
        </div>
      </MuiThemeProvider>

    )
  } 
}

export default withRouter(Orders);