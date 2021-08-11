import { Component } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { getPost, uploadPost, uploadFileTest } from "../Components/APIUtils";
import { faCommentAlt } from "@fortawesome/free-regular-svg-icons";
import imageCompression from "browser-image-compression";
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
const Content = styled.div``;
const ContentBox = styled.div`
  width: 25rem;
  margin-left: 1rem;
  height: auto;

  margin-right: 6rem;
  margin-top: 0.5rem;
`;
const WritedDate = styled.div`
  padding-top: 0.5rem;
  padding-right: 1.3rem;
  font-size: 0.8rem;
`;
const AreaBox = styled.div`
  display: flex;
  flex-direction: row;
`;
const CommentsBox = styled.div`
  display: flex;
  position: relative;
  right: -16rem;
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

  componentDidMount = () => {
    if (this.props.authenticated === true) {
      getPost().then((response) => {
        this.setState({ posts: response });
      });
    } else {
      this.props.history.push("/login");
    }
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
      var postData = {};
      postData["content"] = this.state.content;
      postData["user"] = this.props.currentUser.id;

      uploadPost(postData).then((response) => {
        this.setState({ posts: response });
      });

      // 파일 업로드 테스트
      const data = await this.compressImage(this.state.files);
      // console.log(typeof data);
      this.handleImageForm(data);
      this.setState({ content: "" });
    }
  };
  handleImageForm = (files) => {
    const imageForm = new FormData();

    files.forEach((file) => {
      imageForm.append("files", file);
    });

    for (var pair of imageForm.entries()) {
      console.log(pair);
    }
    uploadFileTest(imageForm).then(() => {
      console.log("complete");
      this.setState({ files: [], previewURL: [], fileCount: 0, write: false });
    });
  };

  compressImage = async (files) => {
    console.log("compression start");

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
      console.log("압축 후 ");
      return compressedFiles;

      //base64인코딩
      //   let base64Files = [];

      //   for (var i = 0; i < compressedFiles.length; i++) {
      //     const reader = new FileReader();
      //     reader.readAsDataURL(compressedFiles[i]);
      //     //base64로 변환
      //     let base64data;
      //     reader.onloadend = () => {
      //       base64data = reader.result;
      //       base64Files.push(base64data);
      //     };
      //   }
      //   // console.log(base64Files);
      //   return base64Files;
    } catch (error) {
      console.log(error);
    }
  };

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
  // deleteHandler = (e) => {
  //   let postId = {};
  //   postId["id"] = e.target.value;
  //   deletePost(postId).then((response) => {
  //     this.setState({ posts: response });
  //   });
  // };
  movetoPost = (id) => {
    let target = "/board/" + id;
    this.props.history.push(target);
  };

  render() {
    const posts = this.state.posts;
    const postsprint = posts.map((post, index) => (
      <>
        <CommentList
          key={post[0]}
          onClick={() => {
            this.movetoPost(post[0]);
          }}
        >
          <WritingBox>
            <Writer>
              <ProfleImage src={post[6]}></ProfleImage>
              <Name>{post[5]}</Name>
            </Writer>
            <WritedDate>{this.timeForToday(post[2])}</WritedDate>
          </WritingBox>
          <AreaBox>
            <ContentBox>
              <Content>{post[1]}</Content>
            </ContentBox>
            {/*fontawesom 대체 예정  */}
          </AreaBox>
          {/* <Comments id={post.id} /> */}
          <CommentsBox>
            <FontAwesomeIcon icon={faCommentAlt} />
            {post[3]}
          </CommentsBox>
        </CommentList>
      </>
    ));

    const loadImage = this.state.previewURL.map((file, index) => (
      <>
        <PreviewImage src={file} />
        <DeletePreviewImage
          value={index}
          onClick={this.DeletePreviewImageHandler}
        >
          X
        </DeletePreviewImage>
      </>
    ));

    return (
      <UserData>
        <WriteBox onClick={this.handleWrite}>
          <FontAwesomeIcon size="lg" icon={faPencilAlt} />
        </WriteBox>
        {this.state.write && (
          <>
            <ContentForm onSubmit={this.handleSubmit}>
              <InputContent
                name="content"
                value={this.state.content}
                onChange={this.handleChange}
                required
              ></InputContent>

              <ButtonContainer>
                <ImageLabel for="photo">사진</ImageLabel>
                <ImageButton
                  type="file"
                  accept=".jpg, .png, .jpeg, .gif"
                  name="photo"
                  multiple
                  id="photo"
                  onChange={this.handleFileInput}
                ></ImageButton>
                <SubmitLabel for="submit">작성</SubmitLabel>
                <SubmitButton type="submit" id="submit"></SubmitButton>
              </ButtonContainer>
            </ContentForm>

            <PreviewImageContainer>{loadImage}</PreviewImageContainer>
          </>
        )}
        <UserListContainer>{postsprint}</UserListContainer>
      </UserData>
    );
  }
}
