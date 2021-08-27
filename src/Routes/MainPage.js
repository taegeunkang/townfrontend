import { Component } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, fas } from "@fortawesome/free-solid-svg-icons";
import {
  getPost,
  setLike,
  setDisLike,
  uploadFileTest,
  loadImage,
  getLike,
  getDisLike
} from "../Components/APIUtils";
import { faCommentAlt } from "@fortawesome/free-regular-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import imageCompression from "browser-image-compression";
import { ReactTinyLink } from 'react-tiny-link'
import {AiOutlineLike,AiOutlineDislike, AiTwotoneLike, AiTwotoneDislike, AiFillHeart} from "react-icons/ai"
import {RiChat1Line} from "react-icons/ri";
import {HiOutlineEmojiSad} from "react-icons/hi";

const UserData = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LastPage = styled.div`
  font-size: 2rem;
  color: white;
`;
const CommentList = styled.li`
  list-style: none;
  width: 100%;
  padding-right: 0px;
  padding-left: 0px;
  background-color: white;
  margin-bottom: 0.3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  
  
`;

const UserListContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Content = styled.div`
  width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;;
  margin-bottom: 1rem;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
`;
const ContentBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 0.7rem;
  margin-bottom: 1rem;
`;
const WritedDate = styled.div`
  padding-right: 0.5rem;
  font-size: 0.7rem;
`;

const CommentsBox = styled.div`
  display: flex;
  width: 100%;
  height: 1.7rem;
  border-top: 0.2px solid rgba(0,0,0,0.2);
  
`;
const Name = styled.span`
  font-size:0.8rem;
  font-weight: 600;
`;

const ProfleImage = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 25%;
  margin-right:0.3rem;
`;
const Writer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.3rem;
`;
const WriteBox = styled.div`
  position: absolute;
  right: 2rem;
  top: 1.4rem;
`;
const PreviewImageContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;
const WritingBox = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding-top: 0.4rem;
  justify-content: space-between;
  padding-bottom: 0.4rem;
  border-bottom: 0.2px solid rgba(0,0,0,0.2);
`;

const Likes = styled.div`
  width: 33.3%;
  border-right: 0.2px solid rgba(0,0,0,0.2);
  display:flex;
  justify-content:center;
`;
const Comment = styled.div`
  width: 33.3%;
  border-right: 0.2px solid rgba(0,0,0,0.2);
  display:flex;
  justify-content:center;
  align-items:center;
  
`;
const CountBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 0.7rem;
  color:rgba(0,0,0,0.5);
  padding-left: 1rem;
  box-sizing: border-box;
  padding-bottom: 0.3rem;
`;
const LoadingContainer = styled.div`
  color: white;
  font-size: 2rem;
`;
const Share = styled.div`
  width: 33.3%;
  display:flex;
  justify-content:center;
`;
const More = styled.div`
  font-size: 2rem;
`;
const Like = styled.div`
  width:50%;
  display:flex;
  color: black;
  justify-content:center;
  align-items: center;
  border-right: 0.2px solid rgba(0,0,0,0.2);
`;

const DisLike = styled.div`
   width:50%;
   display:flex;
   color: black;
  justify-content:center;
  align-items: center;
`;
export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      content: "",
      authenticated: false,
      currentUser: {},
      write: false,
      previewURL: [],
      fileCount: 0,
      files: [],
      imageFile: "",
      page: 0,
      scrollHeight: 0,
      scroll: false,
      loading: false,
      last : false,
      like : [],
      dislike : [],
      didLike : [],
      didDisLike: [],
      selectedLike : [],
      selectedDisLike : [],
    };
    this.handleFileInput = this.handleFileInput.bind(this);
    this.compressImage = this.compressImage.bind(this);
  }
  //시간 계산 함수 나중에 사용
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

  componentDidMount = async () => {
    window.addEventListener("scroll", this.listenToScroll);


      

    //linke preview -> 리액트 cheerio 사용 


    
    if (this.props.authenticated === true) {

      const likes = await getLike(this.props.currentUser.id);
      this.setState({didLike: likes});

      const disLikes = await getDisLike(this.props.currentUser.id);
      this.setState({didDisLike : disLikes});
      const number = this.state.page;
      
      const response = await getPost(String(number));

      response.map((post) => {
        this.distinguishLike(post[0]);
        this.distinguishDisLike(post[0]);
        if(this.handleURL(post[1]) !== null){
          post.push(this.handleURL(post[1])[0]);
        }
        
      });
      this.setState({ posts: response });

  
      // //스크롤 임시 
      // if(JSON.parse(window.sessionStorage.getItem("scrollOffset")) !== null) {
        
      //    window.scrollTo(0,300);
      // }
      console.log(response);

    } else {
      this.props.history.push("/login");
    }
  };

  //실시간 스크롤 위치 조회
  listenToScroll = () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop
  
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight
  
    const scrolled = winScroll / height
    this.setState({scrollHeight : scrolled});
    //스크롤이 맨밑이면 게시글 추가로 불러옴
    if(scrolled == 1 && this.state.last == false) {
      console.log("하하하");
      this.loadMorePage();
    }

  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.listenToScroll);
  }
  
  handleURL = (url) => {
    let reg =
    new RegExp("(http(s)?:\/\/|www.)([a-z0-9w]+.*)+[a-z0-9]{2,4}([/a-z0-9-%#?&=w])+(.[a-z0-9]{2,4}([/a-z0-9-%#?&=w]+)*)*");
    return reg.exec(url);

  };
  handleWrite = () => {
    this.setState({ write: !this.state.write });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    // axios.post("http://localhost:3000/post/upload", formData).then((posts) => {
    //   this.setState({ posts: posts.data });
    // });
    if (!this.props.authenticated) {
      alert("로그인이 필요합니다.");
    } else {
      // var postData = {};
      // postData["content"] = this.state.content;
      // postData["user"] = this.props.currentUser.id;

      const postData = new FormData();
      postData.append("content", this.state.content);
      postData.append("user", this.props.currentUser.id);
      const data = await this.compressImage(this.state.files);
      data.forEach((file) => {
        postData.append("files", file);
      });

      // uploadPost(postData).then((response) => {
      //   this.setState({ posts: response });
      // });
      await uploadFileTest(postData);
      const response = await getPost();
      response.map((post) => {
        if(this.handleURL(post[1]) !== null){
          post.push(this.handleURL(post[1])[0]);
        }
        
      });
      this.setState({ posts: response });
      this.setState({
        content: "",
        files: [],
        previewURL: [],
        fileCount: 0,
        write: false,
      });

      // 파일 업로드 테스트

      // console.log(typeof data);
      // this.handleImageForm(data);
      // this.setState({ content: "" });
    }
  };
  handleImageForm = (files) => {
    const imageForm = new FormData();

    files.forEach((file) => {
      imageForm.append("files", file);
    });

    uploadFileTest(imageForm).then(() => {
      this.setState({ files: [], previewURL: [], fileCount: 0, write: false });
    });
  };

  compressImage = async (files) => {

    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
    };
    try {
      let compressedFiles = [];

      for (var j = 0; j < files.length; j++) {
        let compressedfile = await imageCompression(files[j], options);

        compressedFiles.push(compressedfile);
      }
      return compressedFiles;
    } catch (error) {
      console.log(error);
    }
  };
  loadMorePage = async () => {
    let number = this.state.page;
    console.log("called");
    this.setState({loading: true});
    const response = await getPost(String(number +1));
    if(response.length > 0){
      number = number + 1;
    }else {
      console.log("last");
      this.setState({last : true});
    }

    response.map((post) => {
      this.distinguishLike(post[0]);
      this.distinguishDisLike(post[0]);
      if(this.handleURL(post[1]) !== null){
        post.push(this.handleURL(post[1])[0]);
      }
      
    });

    this.setState({page : number, posts: this.state.posts.concat(response), loading: false });

    

  }

  DeletePreviewImageHandler = (e) => {
    let data = [];
    let len = this.state.fileCount;
    for (var i = 0; i < len; i++) {
      if (e.target.value !== i) {
        data.push(this.state.previewURL[i]);
      }
    }
    this.setState({ previewURL: data, fileCount: this.state.fileCount - 1 });
  };
  handleFileInput = async (e) => {
    e.preventDefault();
    const fileArr = e.target.files;
    this.setState({ files: fileArr });

    let fileURLs = [];
    let fileLength = fileArr.length > 5 ? 5 : fileArr.length;
    this.setState({ fileCount: fileLength });

    for (let i = 0; i < fileLength; i++) {
      let reader = new FileReader();
      let imageFile = fileArr[i];
      reader.onloadend = () => {
        fileURLs.push(reader.result);
        this.setState({
          previewURL: this.state.previewURL.concat(reader.result),
        });
      };
      reader.readAsDataURL(imageFile);
    }
  };
  handleChange = (e) => {
    let nextState = [];
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  };

  movetoPost = (id) => {
    const savedata = this.state.posts;
    // window.localStorage.setItem("posts", JSON.stringify(savedata));
    let target = "/board/" + id;
    this.props.history.push(target);
  };
  componentDidUpdate() {
  }

  handleLike = async(e) => {
    const name = e.currentTarget.getAttribute("name");
    const writer = e.currentTarget.getAttribute("value");
    const id = e.currentTarget.getAttribute("id");
    const p = this.state.posts;
    p[id][8] += 1;


    let likes = this.state.like;
    likes[name] = true
    this.setState({like : likes, posts: p});
    let rq = {};
    rq["post"] = name;
    rq["user"] = writer;
    setLike(rq);
    
  }

  handleDisLike = (e) => {
    const name = e.currentTarget.getAttribute("name");
    const writer = e.currentTarget.getAttribute("value");
    const id = e.currentTarget.getAttribute("id");
    const p = this.state.posts;
    p[id][9] += 1
    let dislikes = this.state.dislike;
    dislikes[name] = true
    this.setState({dislike : dislikes, posts: p});
    let rq = {};
    rq["post"] = name;
    rq["user"] = writer;
    setDisLike(rq);
  }
  
  distinguishLike = (id) => {
    const likes = this.state.didLike;

    let selected = this.state.selectedLike;
    for (var i =0; i< likes.length; i++) {
      if(likes[i] == id){
        selected[id] = true;
        this.setState({selectedLike : selected});
        break;
      }
        
    }
  
   
  }
  distinguishDisLike = (id) => {
    const disLikes = this.state.didDisLike;
    let selected = this.state.selectedDisLike;
    for (var j =0; j<disLikes.length; j++) {
      if(disLikes[j] == id){
        selected[id] = true;
        this.setState({selectedDisLike : selected});
        break;
      }
        
    }

  }
  // https://cors-anywhere.herokuapp.com <- react-tiny-link default proxy

  render() {
    const posts = this.state.posts;
    const postsprint = posts.map((post, index) => (
      <>
        <CommentList
          key={post[0]}
        
        >
          <WritingBox>
            <Writer>
              <ProfleImage src={post[6]}></ProfleImage>
              <Name>{post[5]}</Name>
            </Writer>
            <WritedDate>{this.timeForToday(post[2])}</WritedDate>
          </WritingBox>
          <ContentBox   onClick={() => {
            this.movetoPost(post[0]);
          }}>
            <Content>{post[1]}</Content>
            
            {post.length > 10 ? (<ReactTinyLink cardSize="medium" showGraphic={true}  maxLine={2} minLine={1} url={post[10]} proxyUrl="https://cors.bridged.cc" />) : null}
             {post[7] > 0 ? (<ImageComponent count={post[7]} post_id={post[0]} />) : null}
          </ContentBox>
          <CountBox>
            <div style={{marginRight: "0.5rem"}}>
              <AiFillHeart size="1rem" color="#ef476f" />{post[8]}개
            </div>
            <div>
              <HiOutlineEmojiSad size="1rem" color="#fca311"/>{post[9]}개
            </div>
          </CountBox>
          <CommentsBox>
            <Likes>
              <Like name = {post[0]} value ={post[4]} id={index} onClick={this.handleLike}>
                {(this.state.like[post[0]] || this.state.selectedLike[post[0]]) ?<AiTwotoneLike size="1.3rem" /> : <AiOutlineLike  size="1.3rem"/>} 
               </Like>
              <DisLike name = {post[0]} value={post[4]} id={index} onClick={this.handleDisLike}>
                {this.state.dislike[post[0]] || this.state.selectedDisLike[post[0]]? <AiTwotoneDislike size="1.3rem" /> : <AiOutlineDislike size="1.3rem" /> }
                
              </DisLike>
            </Likes>
            <Comment   onClick={() => {
            this.movetoPost(post[0]);
          }}>
            <RiChat1Line size="1.3rem" />
            <span style={{fontSize:"0.8rem",marginBottom:"-0.2rem", marginLeft:"0.1rem"}}>댓글 {post[3]}</span>
            </Comment>
          
            <Share>
            
            </Share>
          </CommentsBox>
        </CommentList>
      </>
    ));


    return (
      <UserData>
        <UserListContainer>{postsprint}</UserListContainer>
        {this.state.last == true ? <LastPage> 마지막</LastPage>: <LoadingContainer> 로딩중</LoadingContainer>}
      </UserData>
    );
  }
}

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  overflow-y: hidden;
  background-color: black;
  position: absolute;

`;

const ContainerBox = styled.div`
  width: 100%;
  height: 100%;
  padding:0px;
  position: relative;
  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
 
  
`;
const ImagePrint = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
`;
export class ImageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      i: "",
    };
  }

  componentDidMount = async () => {
    let count = parseInt(this.props.count);
    if (count > 0) {
      const arr = await this.loadImageFromBackend(this.props.post_id, count);
      this.setState({ files: arr });
    }
  };
  convertTourl = async (arr) => {
    let reader = new FileReader();
    let imageFile = arr;
    let c;
    reader.onloadend = () => {
      c = reader.result;
    };
    reader.readAsDataURL(imageFile);

    return c;
  };

  loadImageFromBackend = async (post_id, count) => {
    let file = [];
    for (var i = 0; i < count; i++) {
      let name = post_id + "/" + "img" + i;
      const response = await loadImage(name);
      const url = URL.createObjectURL(response);
      file[i] = url;
    }
    return file;
  };

  render() {
    const images = this.state.files;
    const imagePrint = images.map((image, index) => (
      <ImagePrint key={index} src={image} alt="이미지"></ImagePrint>
    ));

    return (
      <ContainerBox>
        {images.length > 0 ? (
          <ImageContainer>{imagePrint}</ImageContainer>
        ) : null}
      </ContainerBox>
    );
  }
}
