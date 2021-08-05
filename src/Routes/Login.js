import React, { Component } from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import { FACEBOOK_AUTH_URL, GOOGLE_AUTH_URL } from "../Components/constants";
import googleLogo from "../Components/img/google-logo.png";
import kakaoLogo from "../Components/img/kakao_login_medium_wide.png";

const LoginContainer = styled.div`
  height: 94vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SocialLogin = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Google = styled.a``;

const Facebook = styled.a``;
const Kakao = styled.a``;
const GoogleArea = styled.div`
  width: 15rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;

  margin-bottom: 1rem;
  margin-top: 10rem;
`;
const GoogleLogo = styled.img`
  width: 15rem;
  height: 3rem;
`;
const KakaoArea = styled.div`
  width: 15rem;
  height: 3rem;
`;
const KakaoLogoStyle = styled.img`
  width: 15rem;
  height: 3rem;
`;
export default class Login extends Component {
  componentDidMount() {
    if (this.props.location.state && this.props.location.state.error) {
      console.log("error!");
      this.props.history.replace({
        pathname: this.props.location.pathname,
        state: {},
      });
    }
  }
  render() {
    if (this.props.authenticated) {
      return (
        <Redirect
          to={{
            pathname: "/",
            state: { from: this.props.location },
          }}
        />
      );
    }

    return (
      <LoginContainer>
        <SocialLogin>
          <Google href={GOOGLE_AUTH_URL}>
            <GoogleArea>
              <GoogleLogo src={googleLogo} alt="Google" />
            </GoogleArea>
          </Google>

          <Facebook href={FACEBOOK_AUTH_URL}></Facebook>
          <Kakao>
            <KakaoArea>
              <KakaoLogoStyle src={kakaoLogo}></KakaoLogoStyle>
            </KakaoArea>
          </Kakao>
        </SocialLogin>

        {/* <LocalLogin {...this.props} /> */}
      </LoginContainer>
    );
  }
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
