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
import AccountCircle from '@material-ui/icons/AccountCircle';
import Fab from '@material-ui/core/Fab';
import { matchPath } from 'react-router'
import Item from './Item';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { Button } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import { withRouter } from "react-router-dom";
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';


class OrderDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id.match.params.id,
            items: [],
            itemToAdd: '',
            totalPrice:0
        }
    }

    getItems = url => {
        console.log('gets')
        axios.get(url, { withCredentials: true })
            .then(res => {
                console.log(res.data.items)
                this.setState({ items: res.data.items ,
                    totalPrice:this.getPrice(res.data.items)
                });
                
                if (res.status === 200) {
                    console.log("Got orders")
                }
                else {
                    console.log("orders not found");

                }
            })
            .catch(err => {
                console.log(err);
            })

    }

    getPrice=items=>{
        console.log(items)
        let i,sum=0,price;
        for(i=0;i<items.length;i++){
price=parseInt(items[i].item.price)*parseInt(items[i].orderamount);
sum+=price;
        }
        console.log(sum)
        return sum;
    }

    updateItem = (item) => {
        console.log('test')
        this.setState({ itemToAdd: item });
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
                console.log(err);
            })
    }

    handler = (newItems) => {
        console.log(newItems)
        this.setState({ items: newItems })
        console.log(this.state.items)
    }

    updatePrice=(newExcess)=>{
        const price=this.state.totalPrice+newExcess
        this.setState({ totalPrice: price })

    }


    containsItem = (itemid, list) => {
console.log(list)
console.log(itemid)
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

    addItems = () => {
        console.log('updated');
const items=this.state.items
const itemId=this.state.itemToAdd
console.log(items[0])
console.log(itemId)
console.log(this.containsItem(itemId, items))
        if (this.containsItem(itemId, items) === -1) {
            const url = this.props.url + 'orders/addorderitems/' + this.state.id + '/' + this.state.itemToAdd;

            axios(url, {
                method: "put",
                withCredentials: true
            })
                .then(res => {
                    console.log(res.data.items);

                    if (res.status === 200) {
                        console.log("Got orders")
                        this.setState({ items: res.data.items });
                    }
                    else {
                        console.log("orders not found");

                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }else{
            alert("Item already exists")
        }



    }

    componentDidMount() {
        const url = this.props.url + 'orders/getorder/' + this.state.id;
        console.log(url)
        this.getItems(url);
    }

    render() {
        console.log(this.state.items)


        return (
            <MuiThemeProvider>
                <div>
                    <AppBar
                        title="Order View" >
            <Toolbar></Toolbar>
                        <IconButton color="inherit" aria-label="Logout" onClick={this.logout}>

                            <AccountCircle />

                        </IconButton>
                    </AppBar>
                    <List>
                        {this.state.items.map(item => (
                            <Item updateurl={this.props.url + 'orders/updateorderitems/' + this.state.id}
                                deleteurl={this.props.url + 'orders/removeorderitems/' + this.state.id}
                                handler={this.handler}
                                item={item} items={this.state.items}  updatePrice={this.updatePrice}/>
                        ))}

                    </List>
                    <h1>TotalPrice{this.state.totalPrice}</h1>
                    <TextField
                        id='additem'
                        onChange={(event, newValue) => this.updateItem(newValue)}
                    ></TextField>
                    <Button
                        id='addItemBtn'
                        onClick={this.addItems}>
                        <Fab color="primary" aria-label="Add" className={this.fab} >
                            <AddIcon />
                        </Fab>
                    </Button>

                </div>
            </MuiThemeProvider>
        )
    }



}

export default withRouter(OrderDetails);