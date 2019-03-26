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
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import { Button } from '@material-ui/core';

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.item.item._id,
      name: this.props.item.item.name,
      price: this.props.item.item.price,
      qtyonstock: this.props.item.item.qtyonstock,
      orderamount: this.props.item.orderamount,
      totalPrice:this.props.item.item.price*this.props.item.orderamount,
      items:this.props.items
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.item.item._id !==prevProps.item.item._id) {
    this.setState({
      id: this.props.item.item._id,
      name: this.props.item.item.name,
      price: this.props.item.item.price,
      qtyonstock: this.props.item.item.qtyonstock,
      orderamount: this.props.item.orderamount
      
    })
  }
  if(this.props.items !==prevProps.items) {
    this.setState({
   items:this.props.items
      
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

  updateItem = (number) => {
    console.log('test')
    console.log(this.state.qtyonstock)
    const newNum = number - this.state.orderamount;
    this.updateItems(newNum);
    this.props.updatePrice(newNum*parseInt(this.state.price));
   }
  updateItems = (num) => {
    const updateurl = this.props.updateurl + '/' + this.state.id;
    console.log(num);

    axios(updateurl, {
      method: "put",
      withCredentials: true,
      data: { value: num }
    }).then(res => {
      if (res.status === 200) {
        console.log("Got orders")
        console.log('test' + res.data.qtyonstock)
        this.setState({
          orderamount: res.data.orderamount,
          qtyonstock: res.data.qtyonstock,
          totalPrice:parseInt(res.data.orderamount)*parseInt(this.state.price)
        });
        const newItems=this.state.items
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
  


  deleteItem = () => {
    console.log('del')

    const items = this.state.items;
    console.log(items)
    const deleteUrl = this.props.deleteurl + '/' + this.state.id;
    axios(deleteUrl, {
      method: "put",
      withCredentials: true
    }).then(res => {
      if (res.status === 200) {

        const newItems = this.props.items.filter(item => res.data._id !== item.item._id)


        console.log(newItems);

        this.props.handler(newItems);
        const priceToDeduct=-parseInt(this.state.price)*parseInt(this.state.orderamount);
        this.props.updatePrice(priceToDeduct);

        console.log("deleted item")

      }
      else {
        console.log("deleted not found");

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
    return (

      <div>
        <MuiThemeProvider>
          <ListItem onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} style={linkStyle}  >
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell><h1>{this.state.name}</h1>
                    <p>price {this.state.price}</p>
                    <p>orderamount {this.state.orderamount}</p>
                    <p>qtyonstock {this.state.qtyonstock}</p>
                  </TableCell>


                  <TableCell align="right">
                    <TextField
                      type="number"
                      id="outlined-name"
                      defaultValue={this.state.orderamount}
                      min={0}
                      max={this.state.orderamount + this.state.qtyonstock}
                      variant="outlined"
                      onChange={(event, newValue) => this.updateItem(newValue)}

                    />
                    <p>Price : {this.state.totalPrice}</p>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      id='delItemBtn'
                      onClick={this.deleteItem}>
                      <Fab disabled aria-label="Delete" className={this.fab} >
                        <DeleteIcon />
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


export default Item;