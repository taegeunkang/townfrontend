import React, { Component } from "react";
import styled from "styled-components";
import { getOnePost, editPost } from "../Components/APIUtils";

const EditContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Button = styled.label`
  position: relative;
  bottom: 11rem;
  left: 1rem;
`;
const EditForm = styled.form``;
const SubmitButton = styled.button`
  display: none;
`;
const TextForm = styled.textarea`
  width: 25rem;
  height: 12rem;
  font-size: 1rem;
  overflow-y: scroll;
  margin-top: 2rem;
`;
export default class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      authenticated: false,
      currentUser: [],
    };
  }

  componentDidMount() {
    this.setState({
      authenticated: this.props.authenticated,
      currentUser: this.props.currentUser,
    });
    getOnePost(this.props.match.params.number)
      .then((response) => {
        this.setState({ content: response[0][1] });
      })
      .catch((error) => {
        this.props.history.push("/");
      });
  }
  onChangeHandler = (e) => {
    let data = e.target.value;
    this.setState({ content: data });
  };
  submitHandler = (e) => {
    e.preventDefault();
    let submitData = {};
    submitData["id"] = parseInt(this.props.match.params.number);
    submitData["content"] = this.state.content;


    editPost(submitData).then((response) => {
      if (response !== 0) {
        window.location.replace("/");
        
      }
    });
  };
  render() {
    return (
      <EditContainer>
        <EditForm onSubmit={this.submitHandler}>
          <TextForm
            name="content"
            maxLength="255"
            value={this.state.content}
            onChange={this.onChangeHandler}
          />
          <Button for="submit">확인</Button>
          <SubmitButton type="submit" id="submit" />
        </EditForm>
      </EditContainer>
    );
  }
}
