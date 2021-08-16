import { Component } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import {
  getPost,

  uploadFileTest,
  loadImage,
} from "../Components/APIUtils";
import { faCommentAlt } from "@fortawesome/free-regular-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import imageCompression from "browser-image-compression";
import { ReactTinyLink } from 'react-tiny-link'
import {GrLike, GrDislike} from "react-icons/gr";

const UserData = styled.div`
  width: 100vw;
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
  border-bottom: 1px solid black;
  width: 100%;
  height: 11rem;
`;
const CommentList = styled.li`
  list-style: none;
  width: 100%;
  border-bottom: 1px solid black;
  border-top: 1px solid black;
  background-color: white;
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const InputContent = styled.textarea`
  width: 27rem;
  margin-left: 3rem;
  height: 7rem;
  border: 1px solid black;
  font-size: 1.3rem;
`;
const UserListContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SubmitButton = styled.button`
  display: none;
`;
const SubmitLabel = styled.label`
  border: 1px solid black;
  width: 3rem;
  height: 1.5rem;
  padding: 0px;
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
  width: 35rem;
  padding-left: 2rem;
  padding-right: 2rem;;
  margin-bottom: 1rem;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
`;
const ContentBox = styled.div`
  width: 35rem;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 0.7rem;
  margin-bottom: 1rem;
`;
const WritedDate = styled.div`
  padding-top: 0.5rem;
  padding-right: 1.3rem;
  font-size: 0.8rem;
`;

const CommentsBox = styled.div`
  display: flex;
  width: 37rem;
  border-top: 0.7px solid rgba(0,0,0,0.3);
  margin-top: 0.3rem;
  padding-top: 0.5rem;
  
`;
const Name = styled.div``;

const ProfleImage = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 25px;
`;
const Writer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1rem;
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
  width: 37rem;
  justify-content: space-between;
`;
const PreviewImage = styled.img`
  width: 7rem;
  height: 7rem;
`;
const DeletePreviewImage = styled.button`
  width: 1rem;
  height: 1rem;
  position: relative;
  top: -3rem;
  right: 2rem;
  color: white;
  background-color: transparent;
  border: none;
`;
const Likes = styled.div`
  width: 33.3%;
  border-right: 0.7px solid rgba(0,0,0,0.3);
  display:flex;
  justify-content:center;
`;
const Comment = styled.div`
  width: 33.3%;
  border-right: 0.7px solid rgba(0,0,0,0.3);
  display:flex;
  justify-content:center;
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
  justify-content:center;
`;

const DisLike = styled.div`
   width:50%;
   display:flex;
  justify-content:center;
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
    console.log("called componentDidmount");
    window.addEventListener("scroll", this.listenToScroll);

    if (this.props.authenticated === true) {
      const number = this.state.page;
    
      const response = await getPost(String(number));
      console.log("get new posts");
      
      response.map((post) => {
        if(this.handleURL(post[1]) !== null){
          post.push(this.handleURL(post[1])[0]);
        }
        
      });
      this.setState({ posts: response });
  
      // //스크롤 임시 
      // if(JSON.parse(window.sessionStorage.getItem("scrollOffset")) !== null) {
        
      //    window.scrollTo(0,300);
      // }

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
    // console.log(scrolled);
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
    number = number + 1;
    const response = await getPost(String(number));
    console.log(response);

    this.setState({page : number, posts: this.state.posts.concat(response) });
    console.log(this.state.page)

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
  
    // console.log("called componentDidUpdate");
   
    // const height =
    // document.documentElement.scrollHeight -
    // document.documentElement.clientHeight;
    // let cnt =0;
    // if(height == JSON.parse(window.sessionStorage.getItem("height")) && !this.state.scroll) {
    //   const scrollOffset = window.sessionStorage.getItem("scrollOffset");
    //   this.setState({scroll: true});
    //   if(scrollOffset !== null){
    //     window.scrollTo({top: JSON.parse(window.sessionStorage.getItem("scrollOffset")), behavior:"smooth"});
    //     window.sessionStorage.removeItem("scrollOffset");
    //   }

    // }

  }

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
            
            {post.length > 8 ? (<ReactTinyLink cardSize="medium" showGraphic={true}  maxLine={2} minLine={1} url={post[8]} proxyUrl="https://cors.bridged.cc" />) : null}
            <ImageComponent count={post[7]} post_id={post[0]} />
          </ContentBox>

          <CommentsBox>
            <Likes>
              <Like>
            <GrLike />
            </Like>
            <DisLike>
            <GrDislike />
            </DisLike>
            </Likes>
            <Comment   onClick={() => {
            this.movetoPost(post[0]);
          }}>
            <FontAwesomeIcon icon={faCommentAlt} />
            {post[3]}
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
        <More onClick={this.loadMorePage}>더 보기</More>
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
`;

const ContainerBox = styled.div`
  width: 100%;
  height: 100%;
 
  
`;
const ImagePrint = styled.img`
  width: 35rem;
  height: 35rem;
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
