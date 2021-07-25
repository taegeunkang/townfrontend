import "./App.css";
import { Component } from "react";
import axios from "axios";
import styled from "styled-components";

const UserData = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

`;

const UserForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 500px;
  height: 200px;
  margin-top:150px;
  margin-bottom: 40px;
`;
const UserList = styled.li`
  list-style: none;
  width:200px;
  border: 1px solid black;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;

`;
const UserListContainer = styled.div`
  width: 300px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const DeleteBox = styled.button`
  cursor: grab;
`;


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      name: "",
      adr: "",
      age: "",
    };
  }

  componentDidMount() {
    console.log("did");
    axios
      .post("http://localhost:3000/users")
      .then((users) => this.setState({ users: users.data }));
    
    console.log(this.state.users);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", this.state.name);
    formData.append("adr", this.state.adr);
    formData.append("age", this.state.age);
    axios.post("http://localhost:3000/user", formData).then((users) => {
      this.setState({ users: users.data });
    });
  };
  handleChange = (e) => {
    let nextState = [];
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  };
  deleteHandler = (e) => {
    console.log(e.target.value);
    let target = e.target.value;
    const formData = new FormData();
    formData.append("id", target);
    axios.post("http://localhost:3000/users/delete", formData).then((users) =>{
      this.setState({users: users.data});
    })
  }

  render() {
    const users = this.state.users;
    const usersprint = users.map((user, index) => (
      <>
        <UserList key={user.id}>
          <span>{user.name}</span>
          <span>{user.adr}</span>
          <span>{user.age}</span>
          <DeleteBox onClick={this.deleteHandler} value={user.id} >X</DeleteBox>
        </UserList>
      </>
    ));
    return (
      <div>
        <UserData>
          <UserForm onSubmit={this.handleSubmit}>
            <label for="name">이름</label>
            <input
              id="name"
              name="name"
              type="text"
              value={this.state.name}
              onChange={this.handleChange}
            ></input>
            <label for="adr">주소</label>
            <input
              id="adr"
              name="adr"
              type="text"
              value={this.state.adr}
              onChange={this.handleChange}
            ></input>
            <label for="age">나이</label>
            <input
              id="age"
              name="age"
              type="number"
              value={this.state.age}
              onChange={this.handleChange}
            ></input>
            <input type="submit" id="제출"></input>
          </UserForm>
          <UserListContainer>{usersprint}</UserListContainer>
        </UserData>
      </div>
    );
  }
}
