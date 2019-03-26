import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Https from '@material-ui/icons/Https';
import Fab from '@material-ui/core/Fab';
import  Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from  '@material-ui/core/TableBody';
import { Grid, GridListTile } from '@material-ui/core';
import {Link} from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { Button } from '@material-ui/core';
import SettingBackupRestore from '@material-ui/icons/SettingsBackupRestore';

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.order._id,
      createdBy: this.props.order.createdby,
      status: this.props.order.status
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.order._id !==prevProps.order._id) {
    this.setState({
      id: this.props.order._id,
      createdBy: this.props.order.createdby,
    })
  }
}
  toggleHover = () => {
    this.setState({ hover: !this.state.hover })
  }

 styles = theme => ({
  fab: {
    margin: theme.spacing.unit,
    
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});
updateOrder=()=>{
  let status;
 if(this.state.status==='open'){
   status='close';
  }else{
    status='open'
  }


  axios('http://localhost:3000/orders/updateorder/'+this.state.id, {
    method: "put",
    withCredentials: true,
    data: { status: status }
  }).then(res => {
    if (res.status === 200) {
     console.log('update order');
    
     this.props.updateOrders(this.state.id,status);

    }
   
  })
    .catch(err => {
      if(err.status===401){
        alert('Session has timedout please login again ');
        this.props.history.push("/login");
      }
      console.log(err);
    })
}


  render() {
console.log(this.state.createdBy)
    var linkStyle;
    if (this.state.hover) {
      linkStyle = {
        backgroundColor: '#ddd',
        margin: 15,
        padding: 20,
        cursor: 'pointer'
      }
    } else {
      linkStyle = {
        backgroundColor: '#eee',
        margin: 15,
        padding: 20,
        cursor: 'pointer'
      }
    }

let icon;
    if (this.state.status==='open') {
      icon = <Https />;
    } else {
      icon = <SettingBackupRestore/>;
    }

    return (
      <div>
        <MuiThemeProvider>
       
          <ListItem onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} style={linkStyle}  >
          <Table>
     <TableBody>
       <TableRow>
       <Link to= { `/orderDetails/${this.state.id}` }>
        <TableCell >
          <p>OrderID {this.state.id}<br/> 
          Created by {this.state.createdBy}</p>
          </TableCell>
          </Link>
        <TableCell>
        <h1>{this.state.status}</h1>
        </TableCell>
        <TableCell>
        <Button
                      name='btn'
                      id='updOrderBtn'
                      onClick={this.updateOrder}>
        <Fab disabled aria-label="Delete" className={this.fab}>
        {icon}
      </Fab>
      </Button>
      </TableCell>
        </TableRow>
        </TableBody>
     </Table>
          </ListItem>
          
        
        </MuiThemeProvider>
      </div>
    )
  }

}


export default Order;