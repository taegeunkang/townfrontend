
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

const ContentForm = styled.form`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  width: 38rem;
  height: 11rem;
  margin-top:150px;
  margin-bottom: 40px;
`;
const CommentList = styled.li`
  list-style: none;
  width:38rem;
  border: 1px solid black;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
 
  margin-bottom: 1.5rem;

`;
const InputContent = styled.textarea`
  width:20rem;
  height:7rem;
  border:1px solid black;
  font-size: 1.3rem;
`;
const UserListContainer = styled.div`
  width: 1000px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const DeleteBox = styled.button`
  cursor: auto;
  background-color: transparent;
  width: 1rem;
  height: 1rem;
  position: relative;
  left: 2.5rem;
  bottom:0.4rem;
  border: none;
  
`;
const SubmitButton = styled.button`
  display: none;

`;
const SubmitLabel = styled.label`
border: 1px solid black;
  width: 3rem;
  height:1.5rem;
  padding:0px;
  margin: 0px;
  text-align: center;
  `;
const ImageButton = styled.input`
  display: none;

`;

const ImageLabel = styled.label`
  width: 3rem;
  height: 1.5rem;
  border: 1px solid black;
  text-align: center;
`;
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 7rem;
`;
const Content = styled.div`

`;
const ContentBox = styled.div`
  width: 25rem;
  height: 5rem;
  border: 1px solid black;
  margin-right:6rem;
  margin-top:0.5rem;
`;
const WritedDate = styled.div`
  margin-right: 26rem;
  margin-top: 0.3rem;
  font-size: 0.7rem;
`;
const AreaBox = styled.div`
  display: flex;
  flex-direction: row;

`;
const CommentsBox = styled.div`
  position: relative;
  left:13rem;
  bottom: 0.4rem;
`;
export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      content:"",
    
    };
   
  }
  //시간 계산 함수 나중에 사용 
  timeForToday = (value) => {
    const today = new Date();
    const timeValue = new Date(value);

    const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
    if (betweenTime < 1) return '방금전';
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
          <WritedDate>{post[2].substr(0,10)}</WritedDate>
          <AreaBox>
          <ContentBox>
          <Content>{post[1]}</Content>
          </ContentBox>
          {/*fontawesom 대체 예정  */}
          <DeleteBox onClick={this.deleteHandler} value={post[0]} >X</DeleteBox>
          </AreaBox>
          {/* <Comments id={post.id} /> */}
          <CommentsBox>
          <CommentsCopy id={post[0]} count={post[3]}/>
          </CommentsBox>
        </CommentList>
      </>
    ));

    return (
      <div>
        <UserData>
          <ContentForm onSubmit={this.handleSubmit}>
            <InputContent
              name="content"
              value={this.state.content}
              onChange={this.handleChange}
            ></InputContent>
            <ButtonContainer>
            <ImageLabel for="inputImage">사진</ImageLabel>
            <ImageButton type="file" id="inputImage"></ImageButton>
            <SubmitLabel for="submit" >작성</SubmitLabel>
            <SubmitButton type="submit" id="submit"></SubmitButton>
            </ButtonContainer>
          </ContentForm>
       <UserListContainer>{postsprint}</UserListContainer>
        </UserData>
      </div>
    );
  }
}
