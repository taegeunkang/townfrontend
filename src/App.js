
import React from "react";
import styled from "styled-components";
import {BrowserRouter as Router, Route} from "react-router-dom";
import MainPage from "./Routes/MainPage";
const Container = styled.div`
 display: flex;
 flex-direction: column;
 width: 100%;
 height: 100vh;
 padding: 0px;
 margin: 0px;
`;

function App() {
  return (<Container>
    <Router>
      <MainPage />
    </Router>
  </Container>);
}

export default App;