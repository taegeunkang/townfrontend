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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
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
      <div>
        <Router>
          <AppHeader
            authenticated={this.state.authenticated}
            onLogout={this.handleLogout}
            currentUser={this.state.currentUser}
          />

          <Container>
            <Route
              exact
              path="/"
              render={(props) => (
                <MainPage
                  authenticated={this.state.authenticated}
                  currentUser={this.state.currentUser}
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
              authenticated={this.state.authenticated}
              currentUser={this.state.currentUser}
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
          </Container>
        </Router>
      </div>
    );
  }
}

export default App;
