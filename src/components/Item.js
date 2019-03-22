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
      orderamount: this.props.item.orderamount
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
  }

  updateItems = (num) => {
    const updateurl = this.props.updateurl + '/' + this.state.id;
    console.log(num);
    axios.put(updateurl,
      {
        value: num
      })
      .then(res => {


        if (res.status === 200) {
          console.log("Got orders")
          console.log('test' + res.data.qtyonstock)
          this.setState({
            orderamount: res.data.orderamount,
            qtyonstock: res.data.qtyonstock
          });
        }
        else {
          console.log("orders not found");

        }
      })
      .catch(err => {
        console.log(err);
      })

  }
  containsItem = (itemid, list) => {

    let i;
    for (i = 0; i < list.length; i++) {
      console.log('obj' + itemid)
      console.log('id' + list[i].item._id)
      if (itemid === list[i].item._id) {
        return i;
      }
    }
    return -1;
  }


  deleteItem = () => {
    console.log('del')
    const items = this.props.items;
    console.log(items)
    const deleteUrl = this.props.deleteurl + '/' + this.state.id;
    axios.put(deleteUrl)
      .then(res => {
        if (res.status === 200) {

          const newItems = items.filter(item => res.data._id !== item.item._id)


          console.log(newItems)

          this.props.handler(newItems);
          console.log("deleted item")

        }
        else {
          console.log("deleted not found");

        }
      })
      .catch(err => {
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