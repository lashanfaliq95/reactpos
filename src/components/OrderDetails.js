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
import { matchPath } from 'react-router'
import Item from './Item';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { Button } from '@material-ui/core';

class OrderDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id.match.params.id,
            items: [],
            itemToAdd:''
        }
    }

    getItems = url => {
        axios.get(url)
            .then(res => {
                console.log(res.data.items)
                this.setState({ items: res.data.items });
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
    updateItem= (item)=>{
        console.log('test')
        this.setState({itemToAdd:item});
      }
      


    handler=(items)=>{
        this.setState({items:items})
    }


    addItems= ()=>{
        console.log('updated');
        const url = this.props.url +'orders/addorderitems/' + this.state.id+'/'+this.state.itemToAdd;
        axios.put(url)
        .then(res => {
            console.log(res.data.items );
            this.setState({ items: res.data.items });
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

    componentDidMount() {
        const url = this.props.url +'orders/getorder/' + this.state.id;
        console.log(url)
        this.getItems(url);
    }

    render() {
        console.log(this.state.items)


        return (
            <MuiThemeProvider>
                <div>
                    <AppBar
                        title="Order View" />
                    <List>
                        {this.state.items.map(item => (
                            <Item updateurl={this.props.url+'orders/updateorderitems/'+this.state.id} 
                                deleteurl={this.props.url+'orders/removeorderitems/'+this.state.id} 
                                handler={this.handler}
                            item={item} items={this.state.items} />
                        ))}

                    </List>
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

export default OrderDetails;