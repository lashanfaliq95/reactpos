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


export default class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
     orders:[]
    }
  }

  getOrders = url => {
    axios.get(url)
     .then(res => {
       this.setState({orders:res.data});
       if (res.status === 200) {
         console.log("Got orders")
       }
       else{
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


  render() {    
    console.log(this.state.orders);
    return (
      
          <MuiThemeProvider>
              <div>
          <AppBar
            title="Orders" />
          <List>
        {this.state.orders.map(order=>(
           <Order order={order}/>
        )) }


          </List>
          
          </div>
          </MuiThemeProvider>
     
    )
  }
}
