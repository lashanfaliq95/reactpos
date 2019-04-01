import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {TableBody, TableRow, TableCell, Table, Fab, ListItem } from '@material-ui/core';
import { SettingsBackupRestore, Https } from '@material-ui/icons';

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
    if (this.props.order._id !== prevProps.order._id) {
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
  updateOrder = () => {
    let status;
    if (this.state.status === 'OPEN') {
      status = 'CLOSE';
    } else {
      status = 'OPEN'
    }


    axios('http://localhost:3000/orders/updateorder/' + this.state.id, {
      method: "put",  
      withCredentials: true,
      data: { status: status }
    }).then(res => {
      if (res.status === 200) {
        console.log('update order');

        this.props.updateOrders(this.state.id, status);

      }

    })
      .catch(err => {
        if (err.status === 401) {
          alert('Session has timedout please login again ');
        }
        console.log(err);
      })
  }


  render() {
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
    //change button based on the order status
    if (this.state.status === 'open') {
      icon = <Https />;
    } else {
      icon = <SettingsBackupRestore />;
    }

    return (
      <div>
        <MuiThemeProvider>

          <ListItem onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} style={linkStyle}  >
            <Table>
              <TableBody>
                <TableRow>
                 
                    <TableCell >
                    <Link to={`/orderDetails/${this.state.id}`}>
                      <p>OrderID {this.state.id}<br />
                        Created by {this.state.createdBy}</p>
                        </Link>
                    </TableCell>
                 
                  <TableCell>
                    <h1>{this.state.status}</h1>
                  </TableCell>

                  <TableCell>
                    
                      <Fab 
                        name='btn'
                        id='updOrderBtn'
                        onClick={this.updateOrder}
                       aria-label="Delete" 
                      className={this.fab}>
                        {icon}
                      </Fab>
                   
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