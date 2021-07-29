
import React, {Component} from "react";
import axios from "axios";
import styled from "styled-components";

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ListsContainer = styled.ul`
  display: flex;
  flex-direction: column;
`;
export default class ComemntPage extends Component{
  constructor(props) {
    super(props);
    
    this.state = {
      comment: "",
      comments:[],
      shownComments: false,
      id : 0,
      commentsCount: 0,
    };

  }

  // const [shownComments, setShownComments] = useState({});
  // const [comment, setComment] = useState({content:""});
  // const [comments, setComments] = useState([]);
  componentDidMount = async() => {
    this.setState({id: this.props.id, commentsCount:this.props.count});
    // const cdata = await axios.get("http://localhost:3000/comment/load",{params :{"post": this.state.id}});
    // this.setState({comments: cdata});

    
  }

  handleChange = (event) => {
    this.setState({comment: event.target.value});
  }
  
  toggleComment = async() => {
    const cdata = await axios.get("http://localhost:3000/comment/load",{params :{"post": this.state.id}});
    this.setState({shownComments: !this.state.shownComments, comments: cdata.data});

  }



  handleSubmit = async(e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", this.state.comment);
    formData.append("post", this.props.id);
    axios.post("http://localhost:3000/comment/insert", formData).then((commentsdata)=> {
        this.setState({comments: commentsdata.data});
    })
    this.setState({comment: ""});
  }

  render() {
    const comments = this.state.comments;
    const commentsList = comments.map((comment, index) => (<li key={index}><span>{comment.content}</span> <span>작성 시간 {comment.createdDate.substr(0,10)}</span></li>));
    
  
          return (
            <CommentContainer>
                <div onClick={this.toggleComment} >댓글 {this.state.commentsCount}개</div>
                {this.state.shownComments && comments &&
                  <>
                  <ListsContainer>{commentsList}</ListsContainer>
                <div>
                  <form onSubmit={this.handleSubmit}>
                    <input type="text" name="comment" value = {this.state.comment} onChange={this.handleChange}/>
                  </form>
                </div> 
                </>} 
                
                
            </CommentContainer>  
          );
      }
}