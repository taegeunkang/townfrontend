import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { getOnePost, deletePost } from "../Components/APIUtils";
import Comments from "../Components/Comments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { useHistory } from "react-router";
const BoardContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const Content = styled.div`
  border-bottom: 1px solid black;
  padding: 1rem 3rem;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem;
`;
const EditBox = styled.div`
  width: 2.4rem;
  display: flex;
  justify-content: space-between;
`;
export default function Board({ authenticated, currentUser, match }) {
  const [content, setContent] = useState([]);
  const { number } = useParams();
  const history = useHistory();

  useEffect(() => {
    getOnePost(number)
      .then((response) => {
        setContent(response);
        if (response.length === 0) {
          history.push("/");
        }
      })
      .catch((error) => {
        history.push("/login");
      });
  }, []);

  //게시글 삭제
  const deleteHandler = () => {
    let postId = {};
    postId["id"] = content[0][0];
    deletePost(postId).then((response) => {});
    // history.push("/");
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
          <Content>{content[0][1]}</Content>
          <Comments id={content[0][0]} currentUser={currentUser}></Comments>
        </BoardContainer>
      ) : null}
    </div>
  );
}

// function LocalLogin() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const loginRequest = Object.assign({}, this.state);
//     login(loginRequest)
//       .then((response) => {
//         localStorage.setItem(ACCESS_TOKEN, response.ACCESS_TOKEN);
//         console.log("successfully logged in!");
//         this.props.history.push("/");
//       })
//       .catch((error) => {
//         console.log("error break!");
//       });
//   };
//   const handleChange = (e) => {
//     var n = e.target.name;
//     if (n == "email") {
//       setEmail(e.target.value);
//     } else {
//       setPassword(e.target.value);
//     }
//   };
//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           name="email"
//           value={email}
//           onChange={handleChange}
//           required
//           placeholder="이메일"
//         />
//         <input
//           type="password"
//           name="password"
//           value={password}
//           onChange={handleChange}
//           required
//           placeholder="비밀번호"
//         />
//         <input type="submit" id="로그인" />
//       </form>
//     </div>
//   );
// }
