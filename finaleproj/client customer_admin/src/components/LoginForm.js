import React, { useContext } from 'react';
import { watchFile } from 'fs';
import './../index.css';
import { UserContext } from '../App';
import {BrowserRouter, Route, PrivateRoute, NavLink, Switch, Redirect} from 'react-router-dom';
import {apiLoginAuthorization} from './apiCalls';
import {validateLoginInput} from './formValidator';

class LoginForm extends React.Component
{
    constructor(props)
    {
        super(props);

        //this.buttonOnclicked = this.buttonOnclicked.bind(this);

        // state
        this.state = {
            username: null,
            userId: null,
            password: null,
            successfull: false,
            optionalMessage: null,
            type: null,
            session: null
        }
        //this.showTeamInfo = this.showTeamInfo.bind(this);
    }

    handleOnChange(event) {
        this.setState({[event.target.name] : event.target.value}, function(){
        });
        
    }

    async handleOnSubmitLogin(event) {          
            //check input data with database
            //return value = boolean
            //call props.onSubmitLoginButton(isloggedin, username, usertype)
            let userLogin = {
                username: this.state.username,
                password: this.state.password
            }
            if(!validateLoginInput(userLogin)) {
                alert('Login failed.(inputError)');
            } else {
                let authorized = false;
                authorized = await apiLoginAuthorization(userLogin);
                if(!authorized.status) {
                    this.setState({successfull: false, optionalMessage: authorized.errorInformation});
                } else {
                    let mess = 'Logged in!'
                    this.setState({successfull: true, optionalMessage: mess});
                    //admin login
                    this.setState({userId: authorized.userId});
                    //localStorage.setItem('loggedIn', true);
                    this.props.onLogin(this.state.successfull, this.state.username, authorized.type, authorized.userId, 'Logged in!');
                }
            }
            
            
            
           

    }

    render() {
        const succ = (
        <div style={{backgroundColor:'lightgreen', height:'auto'}} className='centerDisplayDiv loginFormDiv'>
                Successfully logged in. Please navigate with the buttons above.
        </div>);

        const loginForm = (
        <div className='loginFormBeforeLabelDiv'> <div className='LoginLabelDiv'>


    </div>
    <div className='LoginInputDiv'>
    
        <label htmlFor='username'>Username: </label>
        <input required id='username' name='username' type='text' onChange={(event)=> this.handleOnChange(event)}></input><br/>
        <label htmlFor='password'>Password: </label>
        <input required id='password' name='password' type='password' onChange={(event)=> this.handleOnChange(event)}></input>
        <br></br>
        <button id='submitLoginData' value='login' onClick={(event) => this.handleOnSubmitLogin(event)}>login<Redirect to='/login'>Login</Redirect></button> <br/>
    </div>
    </div>
);
const green = {backgroundColor: 'lightgreen', marginBottom: '5px'};
const red = {backgroundColor: 'salmon', marginBottom: '5px'};
        return(
        
        <div className='loginFormOuterDiv'>
            
            
            <div className='centerDisplayDiv loginFormDiv'>
            <h3 style={{marginBottom: '10px'}}>Login:</h3>
            <div className='errorMessageDiv' style={this.state.successfull ? green : red}>
                   <span  className='errorMessage'>{this.state.optionalMessage != null ? JSON.stringify(this.state.optionalMessage) : ''}</span>
            </div>
                { this.state.successfull ? succ : loginForm }
                
                <br/>
            </div>
        </div>
        )
        
    }
}

export {LoginForm};