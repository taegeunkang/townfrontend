import React, { Component } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route } from "react-router-dom";
import MainPage from "./Routes/MainPage";
import Login from "./Routes/Login";
import { getCurrentUser } from "./Components/APIUtils";
import { ACCESS_TOKEN } from "./Components/constants";
import LoadingIndicator from "./Components/LoadingIndicator";
import OAuth2RedirectHandler from "./Components/OAuth2RedirectHandler";
import AppHeader from "./Components/AppHeader";
import Board from "./Routes/Board";
import Edit from "./Routes/Edit";
import Write from "./Routes/Write";
import PrivateRoute from "./Routes/PrivateRoute";
import Counter from "./Routes/Counter";
import CacheRoute from "react-router-cache-route"; 
import { CacheSwitch } from "react-router-cache-route";
import "./App.css";
import { Reset } from "styled-reset";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 99vw;
  background-color: gray;
  padding: 0px;
  margin: 0px;
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      currentUser: null,
      loading: false,
  
    }; 
    const meta = document.createElement('meta');
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1.0";
    document.getElementsByTagName('head')[0].appendChild(meta);
    
    this.loadCurrentlyLoggedInUser = this.loadCurrentlyLoggedInUser.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  loadCurrentlyLoggedInUser() {
    this.setState({
      loading: true,
    });
    getCurrentUser()
      .then((response) => {
        this.setState({
          currentUser: response,
          authenticated: true,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }
  handleWrite() {
    this.setState({ write: !this.state.write });
  }
  handleLogout() {
    localStorage.removeItem(ACCESS_TOKEN);
    this.setState({
      authenticated: false,
      currentUser: null,
    });
  }
  componentDidMount() {
    this.loadCurrentlyLoggedInUser();
  }

  render() {
    if (this.state.loading) {
      return <LoadingIndicator />;
    }

    return (
      
        <Router>
          
          <Container>
          <AppHeader
            authenticated={this.state.authenticated}
            onLogout={this.handleLogout}
            currentUser={this.state.currentUser}
          />
            <CacheSwitch>
            <CacheRoute
              exact
              path="/"
              render={(props) => (
                <MainPage
                  authenticated={this.state.authenticated}
                  currentUser={this.state.currentUser}
                  page = {0}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/login"
              render={(props) => (
                <Login authenticated={this.state.authenticated} {...props} />
              )}
            />
            <Route
              exact
              path="/oauth2/redirect"
              component={OAuth2RedirectHandler}
            />
            <Route
              path="/board/:number"
              render={(props) => (
                <Board
                  authenticated={this.state.authenticated}
                  currentUser={this.state.currentUser}
                  {...props}
                />
              )}
            />
            <Route
              path="/edit/:number"
              authenticated={this.state.authenticated}
              currentUser={this.state.currentUser}
              component={Edit}
            />
            <PrivateRoute
             path="/write"
             authenticated={this.state.authenticated}
              currentUser={this.state.currentUser}
             component={Write}/>

            <Route path="/count" render= {(props) => (
                <Counter   {...props}/>)}/>
             </CacheSwitch>
          </Container>
        </Router>
      
    );
  }
}

export default App;
