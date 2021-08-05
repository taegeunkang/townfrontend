import React, { Component } from "react";

import styled from "styled-components";
import { loadComment, setComment } from "./APIUtils";

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const CommentWriter = styled.div`
  display: flex;
  margin-left: -2.5rem;
  width: 24%;
  flex-direction: row;
  align-items: center;
`;
const Content = styled.div`
  display: flex;
  width: 42%;
  flex-direction: row;
  justify-content: flex-start;
`;
const ListsContainer = styled.ul`
  display: flex;
  margin-top: 1rem;
  width: 30rem;
  flex-direction: column;
`;
const WritingDate = styled.div`
  width: 33%;
  display: flex;
  justify-content: flex-end;
`;
const Box = styled.div`
  width: 30rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const ProfileImage = styled.img`
  border-radius: 25px;
  width: 1.3rem;
`;
const CommentsContents = styled.li`
  display: flex;
  list-style: none;
  width: 30rem;
  margin-bottom: 0.3rem;
`;
const CloseButton = styled.div`
  margin-right: -30rem;
`;
const CommentsTitle = styled.div``;
export default class ComemntPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: "",
      comments: [],
      shownComments: false,
      id: 0,
      commentsCount: 0,
    };
  }

  // const [shownComments, setShownComments] = useState({});
  // const [comment, setComment] = useState({content:""});
  // const [comments, setComments] = useState([]);
  componentDidMount = async () => {
    this.setState({ id: this.props.id, commentsCount: this.props.count });
    // const cdata = await axios.get("http://localhost:3000/comment/load",{params :{"post": this.state.id}});
    // this.setState({comments: cdata});
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

  toggleComment = async () => {
    // const cdata = await axios.get("http://localhost:3000/comment/load",{params :{"post": this.state.id}});
    // this.setState({shownComments: !this.state.shownComments, comments: cdata.data});
    const cdata = await loadComment(this.state.id);
    console.log(cdata);
    this.setState({
      shownComments: !this.state.shownComments,
      comments: cdata,
    });
  };
  handleComment = () => {
    this.setState({ shownComments: !this.state.shownComments });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    console.log(this.state.comment);
    const info = {};

    info["content"] = this.state.comment;
    info["post"] = this.props.id;
    info["user"] = this.props.currentUser.id;

    console.log(info);
    console.log(JSON.stringify(info));
    setComment(info).then((response) => {
      this.setState({ comments: response });
    });

    // const formData = new FormData();
    // formData.append("content", this.state.comment);
    // formData.append("post", this.props.id);
    // axios
    //   .post("http://localhost:3000/comment/insert", formData)
    //   .then((commentsdata) => {
    //     this.setState({ comments: commentsdata.data });
    //   });
    this.setState({ comment: "" });
  };

  render() {
    const comments = this.state.comments;
    const commentsList = comments.map((comment, index) => (
      <CommentsContents key={index}>
        <Box>
          <CommentWriter>
            <ProfileImage src={comment[6]} alt="profileImage"></ProfileImage>
            <span>{comment[5]}</span>
          </CommentWriter>
          <Content>
            <div>{comment[[2]]}</div>
          </Content>{" "}
          <WritingDate>{this.timeForToday(comment[1])}</WritingDate>
        </Box>
      </CommentsContents>
    ));

    return (
      <>
        {!this.state.shownComments && (
          <CommentsTitle onClick={this.toggleComment}>
            댓글 {this.state.commentsCount}개
          </CommentsTitle>
        )}
        <CommentContainer>
          {this.state.shownComments && comments && (
            <>
              <CloseButton onClick={this.handleComment}>X</CloseButton>
              <ListsContainer>{commentsList}</ListsContainer>
              <div>
                <form onSubmit={this.handleSubmit}>
                  <input
                    type="text"
                    name="comment"
                    value={this.state.comment}
                    onChange={this.handleChange}
                    required
                  />
                </form>
              </div>
            </>
          )}
        </CommentContainer>
      </>
    );
  }
}
