
import React, {Component, useState, Fragment, useEffect} from "react";
import axios from "axios";
import styled from "styled-components";

const CommentContainer = styled.div`
`;
export default function ComemntPage(props){

  const [shownComments, setShownComments] = useState({});
  const [comment, setComment] = useState({content:""});
  const [comments, setComments] = useState([]);


  useEffect(()=> {
    const cdata = axios.get("http://localhost:3000/comment/load",{params :{"post": props.id}});
    setComments(cdata.data);
    // console.log(cdata.data);
    console.log(comments);
  console.log("use effect 실행됨");
},[comments]);

  const handleChange = (event) => {
    setComment({...comment, content: event.target.value});
  };
  
  const toggleComment = async (id) => {
    

    setShownComments(prevShownComments => ({
      ...prevShownComments,
      [id] : !prevShownComments[id]
    }));
    
  
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", comment.content);
    formData.append("post", props.id);
    axios.post("http://localhost:3000/comment/insert", formData).then((commentsdata)=> {
        setComments({...comments, contents: commentsdata.data});
        console.log(comments.contents.data);
    })
  };
 
    return (
      <CommentContainer>
          <div onClick={() => {toggleComment(props.id)}}>댓글</div>
          {shownComments[props.id] ? <div>
            <form onSubmit={(e) => {handleSubmit(e)}}>
              <input type="text" name="comment" value = {comment.content} onChange={handleChange}/>
            </form>
          </div> : null}
      </CommentContainer>  
    );
};