import React, { useContext } from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, PrivateRoute, NavLink, Switch, Redirect} from 'react-router-dom';
import {LoginForm} from './components/LoginForm';
import {SignupForm} from './components/SignupForm';
import {LoginBar} from './components/LoginBar';
import {UserProfile} from './components/UserProfile';
import { connect } from 'react-redux';
//import { store, addStudent, deleteStudent } from './components/store';
import {OrderMain} from './components/OrderMain';
import {OfferMain} from './components/OfferMain';
import {CustomerOverview} from './components/CustomerOverview';


export const UserContext = React.createContext();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn : false,
      userName : '',
      userId: null,
      userType: null,
      session: null
    }

  }
  requireAuth(nextState, replace) {
    //console.log('requires Authentication');
    if(this.state.isLoggedIn === false) {
      replace('/login');
    }
    
  }
  isLoggedIn(){
    //console.log('hallo');
    if(this.state.isLoggedIn === false) {
      return false;
    } else {
      return true;
    }
  }
  systemMessageHandler(message) {
    this.setState({systemMessage: message});
  }
  async onLoginSubmit(loginStatus, username, usertype, userId, mess) {
    await this.setState({isLoggedIn: loginStatus, userName:username, userType: usertype, userId: userId, systemMessage: mess});
  }
  async onLogoutSubmit() {
    await this.setState({isLoggedIn: false, userName:'', userType: null, userId: null});
  }

  onSignupSubmit(signupData) {
    console.log('App.js: signup-button clicked! sign-up-data: ', signupData);
  }
  async unauthorizedRouting() {
    await this.setState({systemMessage: 'You are not authorized to enter this page! Please log in first.'});  
  }

  showDashboard() {
    return(
      <div className="box head menuDiv">
        <ul>
          <NavLink exact to='/'><li>Home</li></NavLink>
          <NavLink exact to='/offers'><li>Offers</li></NavLink>
          <NavLink exact to='/orders'><li>Orders</li></NavLink>
          {this.state.userType === 'admin' ? <NavLink exact to='/customers'><li>Customers</li></NavLink> : ''}
        </ul>
      </div>
    )
  }
  render() {
  const PrivateRoutes = [ <Route exact path="/offers"><OfferMain user={this.state}></OfferMain></Route>, <Route exact path="/orders"><OrderMain user={this.state}/></Route>, <Route exact path='/' component={home}/>, <Route exact path='/profile/'><UserProfile data={this.state}/></Route>, <Route exact path ='/customers/'><CustomerOverview /></Route>]
  const LoginRedirect = <Redirect to='/login' />
    return (
      <div className="wrapper1">
          <UserContext.Provider value={this.state}>
            <BrowserRouter basename="/">
            <div className="box head">
              <div className = "box head loginDiv">
                <LoginBar login={{loginstatus: this.state.isLoggedIn, username: this.state.userName, type: this.state.userType}} onLogout={()=> this.onLogoutSubmit()} />
              </div>  
              <div className="box head menuDiv">
                  {this.state.isLoggedIn ? this.showDashboard() : '' /* Only shows dashboard menu, when logged in*/}
                </div>
            </div>
            <div className="box middle">
              <div className="box middle centerDisplayDiv">
 
                  <Switch>
                    <Route exact path="/login"><LoginForm onLogin={(loginStatus, username, usertype, userId)=> this.onLoginSubmit(loginStatus, username, usertype, userId)} message={this.state.systemMessage}/></Route>
                    <Route exact path="/signup" ><SignupForm onSignupSubmit={(signupData)=>this.onSignupSubmit(signupData)}/></Route>
                    {this.state.isLoggedIn ? PrivateRoutes : LoginRedirect /* Only enables Routing to data when logged in.*/}
                    <Route exact path="/logout" component={logout} />
                    <Route component={pageNotFound} />
                  </Switch>
              </div>  
                  
              
            </div>
            <div className="box bottom">
              
              <hr></hr>
              <p>...footer...</p>
            </div>
          
              
            </BrowserRouter>
          </UserContext.Provider>
        </div> 
      );
  }
}

function pageNotFound() {
  return (<p>404 Error - Page not found!</p>)
}
function home() {
  return(<h2>this is the /home-Page!</h2>);
}
function offers() {
  return(<h2>offers....</h2>);
}

function logout(props) {
  return(<h2>you just got logged out!....</h2>);
}


export default App;
