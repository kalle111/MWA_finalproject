import React from 'react';
import { watchFile } from 'fs';
import './../index.css';
import {BrowserRouter, Route, NavLink, Switch, Redirect} from 'react-router-dom';


function LoginBar(props)
{
   
    const loginStatus = props.login.loginstatus; //add trim
    const username = props.login.username; //add trim
    const usertype = props.login.type;
        const beforeLogin = (
        <ul>
            <NavLink className="box head loginDiv navlink" exact to="/login"><li>LOGIN</li></NavLink>
            <NavLink className="box head loginDiv navlink" exact to="/signup"><li>SIGN-UP</li></NavLink>
        </ul>);
    function handleOnSubmitLogout() {          
            props.onLogout();
    }

        const afertLogin = (
            <ul>
                <NavLink className="box head loginDiv navlink" to={`/profile/`}><li >Hello {usertype}: {username} </li> </NavLink>
                <NavLink to="/logout" onClick={() => handleOnSubmitLogout()}><li >LOGOUT</li></NavLink>
            </ul>
        )
        return(
        <div>
            <ul>
              {loginStatus ? afertLogin : beforeLogin}
            </ul>
        </div>  
        )
        
 }




export {LoginBar};