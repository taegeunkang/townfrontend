
import { Component} from "react";
import axios from "axios";
import styled from "styled-components";
import Comments from "../Components/Comments";
import CommentsCopy from "../Components/CommentsCopy";

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
const CommentList = styled.li`
  list-style: none;
  width:1000px;
  border: 1px solid black;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;

`;
const UserListContainer = styled.div`
  width: 1000px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const DeleteBox = styled.button`
  cursor: grab;
`;


export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      content:"",
    
    };
   
  }

  componentDidMount= () =>{
    axios
      .post("http://localhost:3000/post")
      .then((posts) => (this.setState({ posts: posts.data })));
    
    // const p = await axios.post("http://localhost:3000/post")
    // this.setState({posts: p.data, loading: true});  
    
   
  }


  handleSubmit = async(e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", this.state.content);

    // axios.post("http://localhost:3000/post/upload", formData).then((posts) => {
    //   this.setState({ posts: posts.data });
    // });
    const p = await axios.post("http://localhost:3000/post/upload", formData);
    await this.setState({posts: p.data});
 
    this.setState({content: ""});
    

  }
  handleChange = (e) => {
    
    let nextState = [];
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }
  deleteHandler = (e) => {
    let target = e.target.value;
    const formData = new FormData();
    formData.append("id", target);
    axios.post("http://localhost:3000/post/delete", formData).then((posts) =>{
      this.setState({posts: posts.data});
    })
    
  }
  

  render() {
    
    const posts = this.state.posts;
    const postsprint = posts.map((post, index) => (
      <>
        <CommentList key={post[0]}>
          <span>content : {post[1]}</span>
          <div>
            <span>writed time </span>
          <span>{post[2]}</span>
          {/* <span>{post[2].substr(11,5)}</span> */}
          </div>
          <span>comments {post[3]}</span>
          <DeleteBox onClick={this.deleteHandler} value={post[0]} >X</DeleteBox>
          {/* <Comments id={post.id} /> */}
          <CommentsCopy id={post[0]} />
        
        </CommentList>
      </>
    ));

    return (
      <div>
        <UserData>
          <UserForm onSubmit={this.handleSubmit}>
            <label for="content">content</label>
            <input
              id="content"
              name="content"
              type="text"
              value={this.state.content}
              onChange={this.handleChange}
            ></input>
            <input type="submit" id="sumit" name="submit"></input>
          </UserForm>
       <UserListContainer>{postsprint}</UserListContainer>
        </UserData>
      </div>
    );
  }
}
