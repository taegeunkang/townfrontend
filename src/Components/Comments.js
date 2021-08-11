import React, { Component } from "react";

import styled from "styled-components";
import { loadComment, setComment, deleteComment } from "./APIUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
const CommentContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  box-sizing: border-box;
`;
const Commentinput = styled.input`
  width: 100%;
  height: 1.5rem;
`;
const CommentForm = styled.form`
  display: flex;
  width: 100%;
  justify-content: center;
  padding-top: 1rem;
`;
const CommentWriter = styled.div`
  display: flex;
  flex-direction: row;
  width: 33.3%;
  align-items: center;
`;
const Writer = styled.div``;
const Content = styled.div`
  display: flex;
  width: 33.3%;
  justify-content: flex-start;
  flex-direction: row;
`;

const WritingDate = styled.div`
  display: flex;
  width: 33.3%;
  gap: 1rem;
  justify-content: flex-end;
`;

const ProfileImage = styled.img`
  border-radius: 25px;
  margin-right: 0.3rem;
  width: 1.3rem;
`;
const CommentsContents = styled.li`
  display: flex;

  align-items: center;
  list-style: none;
  width: 100%;
  margin-bottom: 0.7rem;
`;
const DeleteBox = styled.span`
  border: none;
  background-color: transparent;
  width: auto;
  height: auto;
`;

export default class ComemntPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: "",
      comments: [],
      id: 0,
      commentsCount: 0,
    };
  }

  componentDidMount = async () => {
    this.setState({ id: this.props.id });

    loadComment(this.props.id).then((response) => {
      this.setState({ comments: response });
    });
  };

  handleChange = (event) => {
    this.setState({ comment: event.target.value });
  };

  timeForToday = (value) => {
    const today = new Date();
    const timeValue = new Date(value);

    const betweenTime = Math.floor(
      (today.getTime() - timeValue.getTime()) / 1000 / 60
    );
    if (betweenTime < 1) return "방금전";
    if (betweenTime < 60) {
      return `${betweenTime}분전`;
    }

    const betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) {
      return `${betweenTimeHour}시간전`;
    }

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay < 365) {
      return `${betweenTimeDay}일전`;
    }

    return `${Math.floor(betweenTimeDay / 365)}년전`;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const info = {};

    info["content"] = this.state.comment;
    info["post"] = this.props.id;
    info["user"] = this.props.currentUser.id;

    setComment(info).then((response) => {
      this.setState({ comments: response });
    });
    this.setState({ comment: "" });
  };
  deleteHandler = (e) => {
    let target = {};

    target["commentId"] = e.currentTarget.getAttribute("name");
    target["postId"] = e.currentTarget.getAttribute("value");

    deleteComment(target).then((response) => {
      this.setState({ comments: response });
    });
  };

  render() {
    const comments = this.state.comments;
    const commentsList = comments.map((comment, index) => (
      <CommentsContents key={index}>
        <CommentWriter>
          <ProfileImage src={comment[6]} alt="profileImage"></ProfileImage>
          <Writer>{comment[5]}</Writer>
        </CommentWriter>
        <Content>{comment[[2]]}</Content>
        <WritingDate>
          {comment[4] === this.props.currentUser.id ? (
            <>
              <DeleteBox
                name={comment[0]}
                value={comment[3]}
                onClick={this.deleteHandler}
              >
                <FontAwesomeIcon size="1x" icon={faTrashAlt} />
              </DeleteBox>
            </>
          ) : null}
          {this.timeForToday(comment[1])}
        </WritingDate>
      </CommentsContents>
    ));

    return (
      <CommentContainer>
        {comments && (
          <>
            {commentsList}
            <CommentForm onSubmit={this.handleSubmit}>
              <Commentinput
                type="text"
                name="comment"
                placeholder="댓글 입력"
                value={this.state.comment}
                onChange={this.handleChange}
                required
              />
            </CommentForm>
          </>
        )}
      </CommentContainer>
    );
  }
}
