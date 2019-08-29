import React from 'react';
import {BrowserRouter, Route, PrivateRoute, NavLink, Switch, Redirect} from 'react-router-dom';
import { OrderNewOrders} from './OrderNewOrders';
import { OrderOV } from './OrderOV';


export class OrderMain extends React.Component {
    //works both to persist parentStateData from login.
    constructor(props)
    {
        super(props);
        this.state = {
            isLoading: false,
            list: null,
            mode: 'overview',
            profileData: null,
            errorMsg: null
        }
        
    }

    async componentDidMount() {
        console.log(this.props);
    }
    goToOverview() {
        this.setState({mode: 'overview'});
    }
    goToNewOrder()
    {
        this.setState({mode: 'neworder'});
    }    
    renderOverview() {
        //prepare component
        return <b>overview rendered!</b>
    }
    renderNewOrder() {
        return <b> new order body</b>
    }
    render() {
        /*const headline = <h3>Userprofile of {this.props.data.userName}</h3>
        const saveButton = <button onClick={()=> this.saveEditedProfil()}>Save Profile</button>
        const errorSpan = <span className='errorSpanProfile'>{this.state.errorMsg}</span>*/
    
        const ordersMenu = 
        (
        <div className='orderMenuDiv'>
            <ul>
                <li onClick={() => this.goToOverview()}>Overview</li>
                <li onClick={() => this.goToNewOrder()}>New Order</li>
            </ul>
        </div>
        )
        const ordersMenuAdmin = 
        (
            <div className='orderMenuDiv'>
                <ul>
                    <li onClick={() => this.goToOverview()}>Search/Modify Orders</li>
                    <li onClick={() => this.goToNewOrder()}>Waiting items</li>

                </ul>
            </div>
        );



    return(
        <div className='ordersDiv'>
            {this.props.user.userType === 'admin' ? ordersMenuAdmin : ordersMenu}
            <hr/>

            { this.state.mode === 'overview' ? <OrderOV/> : [this.state.mode === 'neworder' ? <OrderNewOrders/> : '']}
            <p>Current "this.state.mode" = {this.state.mode} 
            
            </p>

        </div>
        )
    }
}
