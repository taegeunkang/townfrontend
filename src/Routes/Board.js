import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { getOnePost, deletePost } from "../Components/APIUtils";
import Comments from "../Components/Comments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { useHistory } from "react-router";
import { ReactTinyLink } from 'react-tiny-link'
import { ImageComponent } from "./MainPage";
const BoardContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  box-sizing: border-box;
`;
const Content = styled.div`
  border-bottom: 1px solid black;
  padding: 1% 3%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
  box-sizing: border-box;
`;
const Writer = styled.img`
  width: 2rem;
  border-radius: 25px;
`;
const WriterInfo = styled.div`
  display: flex;
  align-items: center;
`;
const CreatedDay = styled.div`
  margin-left: 0.3rem;
  font-size: 0.7rem;
`;
const WriterContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0px;
  box-sizing: border-box;
`;
const EditBox = styled.div`
  width: 2.4rem;
  display: flex;
  justify-content: space-between;
`;
const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;
const ContentText = styled.div`
  text-align: left;
  margin-bottom: 2%;
  width: 100%;
`;
const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
`;
export default function Board({ authenticated, currentUser, match }) {
  const [content, setContent] = useState([]);
  const { number } = useParams();
  const history = useHistory();

  useEffect(() => {
    console.log("did");
    getOnePost(number)
    .then((response) => {
        if(handleURL(response[0][1]) !== null) {
          response.push(handleURL(response[0][1])[0]);
        }
      if (response.length === 0) {
        history.push("/");
      }
      setContent(response);

    })
    .catch((error) => {
      history.push("/login");
    });
   
  }, []);
  const handleURL = (url) => {
    let reg =
    new RegExp("(http(s)?:\/\/|www.)([a-z0-9w]+.*)+[a-z0-9]{2,4}([/a-z0-9-%#?&=w])+(.[a-z0-9]{2,4}([/a-z0-9-%#?&=w]+)*)*");
    return reg.exec(url);

  };
  //게시글 삭제
  const deleteHandler = () => {
    let postId = {};
    postId["id"] = content[0][0];
    deletePost(postId).then((response) => {});
    // history.push("/");
    window.localStorage.setItem("changed", true);
    window.location.replace("/");
  };

  //게시글 수정
  const editHandler = () => {
    let path = "/edit/" + content[0][0];

    history.push(path);
  };

  //시간 계산 함수 나중에 사용
  const timeForToday = (value) => {
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

  return (
    <div>
      {content.length > 0 ? (
        <BoardContainer>
          <WriterContainer>
            <WriterInfo>
              <Writer src={content[0][5]}></Writer>
              {content[0][4]}
              
              <CreatedDay>{timeForToday(content[0][2])}</CreatedDay>
            </WriterInfo>

            {currentUser.id === content[0][3] ? (
              <EditBox>
                <FontAwesomeIcon onClick={editHandler} icon={faEdit} />
                <FontAwesomeIcon onClick={deleteHandler} icon={faTrashAlt} />
              </EditBox>
            ) : null}
          </WriterContainer>
          <Content>
            <ContentText>{content[0][1]}</ContentText>
          {content.length > 1 ? (<ReactTinyLink cardSize="medium" showGraphic={true}  maxLine={2} minLine={1} url={content[1]} proxyUrl="https://cors.bridged.cc" />) : null}
              {content[0][6] > 0 ? (<ImageContainer>
              <ImageComponent count={content[0][6]} post_id={content[0][0]}  />
              </ImageContainer>) : null}
              
          </Content>
          <Comments id={content[0][0]} currentUser={currentUser}></Comments>
        </BoardContainer>
      ) : <LoadingContainer>
           Loading...
        </LoadingContainer>}
    </div>
  );
}

