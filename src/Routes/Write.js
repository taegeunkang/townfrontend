import React, { Component } from "react";
import styled from "styled-components";
import { uploadFileTest} from "../Components/APIUtils";
import imageCompression from "browser-image-compression";

const WriteContainer = styled.div`
    width: 100%;
    height: 90vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: white;
`;
const WriteForm = styled.form`
    width: 97%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;
const InputText = styled.textarea`
    width: 90%;
    height: 100%;
`;
const Profile = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding-left: 5%;
`;
const ProfileImage = styled.img`
    width: 2rem;
    border-radius: 25px;
`;
const SubmitButton = styled.button`
    background-color: rgba(0,0,0,0.3);
    border: none;
`;
const ImageButton = styled.input`
    display: none;
`;

const ImageLabel = styled.label`
    border: 1px solid black;
`;
const PreviewImage = styled.img`
    width: 10rem;
    height: 10rem;
`;
const ImageContainer = styled.div`
    display: flex;
    justify-content: center;
`;
const DeleteImage = styled.button`
    width: 1rem;
    height: 1rem;
`;
const Buttons = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-end;
`;
export default class Write extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: "",
            files: [],
            fileCount: 0,
            previewURL : [],
        };
        this.handleFileInput = this.handleFileInput.bind(this);
    }
    
    componentDidMount = () => {
        

    }

    handleChange = (e) => {
        this.setState({content: e.target.value});
    }
    handleFileInput = async(e) => {
        e.preventDefault();
        const fileArr = e.target.files;
        this.setState({files: fileArr});    
        const fileLength = fileArr.length > 5 ? 5: fileArr.length;
        this.setState({fileCount : fileLength});
        for(var i=0; i<fileLength; i++) {
            let reader = new FileReader();
            let imageFile = fileArr[i];
            reader.onloadend = () => {
                this.setState({
                    previewURL: this.state.previewURL.concat(reader.result)
                });   
            };
            reader.readAsDataURL(imageFile);
        }
        
    }
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
    handleSubmit = async(e) => {
        e.preventDefault();
       const postData = new FormData();
       postData.append("content", this.state.content);
       postData.append("user", this.props.currentUser.id);
       
       const data = await this.compressImage(this.state.files);
       data.forEach((file) => {
        postData.append("files", file);
      });
     
      await uploadFileTest(postData);
        
      window.location.replace("/");
    
    };
    DeletePreviewImageHandler = (e) => {
        let data = [];
        let file = [];
        let len = this.state.fileCount;
        for(var i =0; i< len; i++) {
            if(e.target.value !== i) {
                data.push(this.state.previewURL[i]);
                file.push(this.state.files[i]);
            }
        }
        this.setState({previewURL : data, files: file,fileCount: this.state.fileCount-1});
    };

    render() {

        const loadImage = this.state.previewURL.map((file, index) =>(
            <>
            <PreviewImage src={file} />
            <DeleteImage value={index} onClick={this.DeletePreviewImageHandler}>
                X
            </DeleteImage>
            </>
        ));
        return (<WriteContainer>
            <Profile>
                <ProfileImage src={this.props.currentUser.imageUrl} />
                {this.props.currentUser.name}
            </Profile>
            <WriteForm onSubmit = {this.handleSubmit}>
                <InputText 
                 name="content"
                 value={this.state.content}
                 onChange={this.handleChange}
                 required>
                </InputText>
                <Buttons>
                <ImageLabel for="photo">사진</ImageLabel>
                <ImageButton
                    type="file"
                    accept = "image/*"
                    name = "photo"
                    multiple
                    id="photo"
                    onChange={this.handleFileInput}
                >
                </ImageButton>

                <SubmitButton type="submit" id="작성">작성</SubmitButton>
                </Buttons>
            </WriteForm>
            <ImageContainer>{loadImage}</ImageContainer>
        </WriteContainer>);
   }
}