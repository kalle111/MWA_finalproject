import React, { useContext } from 'react';
import { watchFile } from 'fs';
import './../index.css';
import { UserContext } from '../App';
import {BrowserRouter, Route, PrivateRoute, NavLink, Switch, Redirect} from 'react-router-dom';
import {apiRegistration} from './apiCalls';

class SignupForm extends React.Component
{
    constructor(props)
    {
        super(props);

        //this.buttonOnclicked = this.buttonOnclicked.bind(this);

        // state
        this.state = {
            optionalMessage: null,
            messageStyle: null,
            success: false
        }
        //this.showTeamInfo = this.showTeamInfo.bind(this);
    }

    componentDidMount() {
        this.setState({success:false});
        this.setState({firstname: null, lastname:null, address:null, postal_code:null, city: null, phon_number: null, accountname: null, acccountpassword:null});
    }

    handleOnChange(event) {
        this.setState({[event.target.name] : event.target.value}, function(){
            //console.log(this.state);
        });
    }
    async onSignupSubmit(event) {
        //function to check password confirmation

        console.log("current state on submit: ", this.state);
        function checkPassword(pw1, pw2) {
            if(pw1===pw2) {
                return true;
            } else {
                return false;
            }
        }
        // 2 cases, passwords match or not. 
        if(!checkPassword(this.state.password, this.state.confirmpassword)) {
            console.log(this.state.password, ", ", this.state.confirmpassword);
            alert('Both passwords have to be the same!!');
        } else {
            const newUser = {
                firstname: this.state.firstname,
                lastname: this.state.lastname,
                address: this.state.address,
                postal_code: this.state.postal_code,
                city: this.state.city,
                phone_number: this.state.phone_number,
                accountname: this.state.username,
                accountpassword: this.state.password
            }
            let listOfUndefined = [];
            for(var key in newUser) {
                //console.log('key: ', key, ' + value: ' + newUser[key]);
                if(newUser[key] === undefined || newUser[key]==='' || newUser[key]=== NaN || newUser[key] === null) {
                  listOfUndefined.push(key);
                }
            }
            console.log('Contains undefined input? ', listOfUndefined);
            if(listOfUndefined.length === 0) {
                //fetch returnObj
                let registrationApi = await apiRegistration(newUser)
                if(registrationApi.status === true) {
                    this.setState({messageStyle: {backgroundColor: 'lightgreen'}});
                    this.setState({success: true});
                    this.setState({optionalMessage: 'Registration successful! Please login now.'});
                    this.props.onSignupSubmit(newUser);
                } else {
                    this.setState({messageStyle: {backgroundColor: 'lightsalmon'}});
                    this.setState({success: false});
                    this.setState({optionalMessage: 'Registration was not successfull. Something with the server went wrong.'});
                }
            } else {
                //alert('check your input! Either empty, undefined of NaN!');
                this.setState({success: false});
                this.setState({messageStyle: {backgroundColor: 'lightsalmon'}}, this.setState({optionalMessage: 'Please check the following field(s): ' + listOfUndefined }));

            }
        }
    }
    
    render() {
        const singupform = (
            <div className='signUpFormInputDiv'>
                    <form action="javascript:void(0);">
                        <h4 style={{textAlign: 'left'}}>Account data:</h4>
                        <label htmlFor='username'>Username: </label>
                        <input id='username' name='username' type='text' onChange={(event)=> this.handleOnChange(event)} required></input><br/>
                        
                        <label htmlFor='password'>Password:  </label>
                        <input required id='password' name='password' type='password' onChange={(event)=> this.handleOnChange(event)}></input><br/>

                        <label htmlFor='confirmpassword'>Confirm password: </label>
                        <input required id='confirmpassword' name='confirmpassword' type='password' onChange={(event)=> this.handleOnChange(event)} required></input><br/>
                        <h4 style={{textAlign: 'left'}}>Personal data:</h4>
                        <label >Firstname: </label>
                        <input id='firstname' name='firstname' type='text' required onChange={(event)=> this.handleOnChange(event)} required></input><br/>
                        <label >Lastname: </label>
                        <input id='lastname' name='lastname' type='text' onChange={(event)=> this.handleOnChange(event)} required></input><br/>
                        <label >Address: </label>
                        <input id='address' name='address' type='text' onChange={(event)=> this.handleOnChange(event)} required={true}></input><br/>
                        <label >Postal Code: </label>
                        <input id='postal_code' name='postal_code' type='number' onChange={(event)=> this.handleOnChange(event)} required></input><br/>
                        <label >City: </label>
                        <input id='city' name='city' type='text' onChange={(event)=> this.handleOnChange(event)} required></input><br/>
                        <label >Phone: </label>
                        <input id='phone_number' name='phone_number' type='text' onChange={(event)=> this.handleOnChange(event)} required></input><br/>
                        <button style={{marginTop: '10px', width:'100px'}} id='submitSignup' value='signup' onClick={(event) => this.onSignupSubmit(event)}>Sign-up!</button>
                    </form>
                     <br/>
                </div>
        )
        const green = {backgroundColor: 'lightgreen'};
        const red = {backgroundColor: 'salmon'};
        return(
            <div className='centerDisplayDiv signUpFormDiv'>
               <h3>Register now:</h3>
               <div className='errorMessageDiv' style={this.state.success ? green : red}>
                   <span  className='errorMessage'>{this.state.optionalMessage != null ? this.state.optionalMessage : ''}</span>
                </div>

               {this.state.success ? '' : singupform}
        </div>
        )
        
    }
}

export {SignupForm};