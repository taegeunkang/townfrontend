
import React, { Component } from "react";
import styled from "styled-components";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import MainPage from "./Routes/MainPage";
import Login from "./Routes/Login";
import { getCurrentUser } from "./Components/APIUtils";
import { ACCESS_TOKEN } from "./Components/constants";
import LoadingIndicator from "./Components/LoadingIndicator";
import OAuth2RedirectHandler from "./Components/OAuth2RedirectHandler";
const Container = styled.div`
 display: flex;
 flex-direction: column;
 width: 100%;
 height: 100vh;
 padding: 0px;
 margin: 0px;
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      currentUser: null,
      loading :false
    }
    
  }

  loadCurrentlyLoggedInUser() {
    this.setState({
      loading : true
    });
    getCurrentUser().then(response => {
      console.log(response);
      this.setState({
        currentUser: response,
        authenticated:true,
        loading : false
      })
    }).catch(error => {
      this.setState({
        loading:false
      });

    });
    
  }
  
  handleLogout() {
    localStorage.removeItem(ACCESS_TOKEN);
    this.setState({
      authenticated:false,
      currentUser:null
    });
    console.log("loged out!");

  }
  componentDidMount() {
    this.loadCurrentlyLoggedInUser();
  }

  render() {
    if(this.state.loading) {
      return <LoadingIndicator />
    }
  return (<Container>
    <Router>
      <Route path="/" exact component={MainPage}/>
      <Route path="/login" render = {(props) => <Login authenticated={this.state.authenticated} {...props}/>} />
      <Route path="/oauth2/redirect" component={OAuth2RedirectHandler}></Route>  
    </Router>
  </Container>);
  }
}

export default App;