import React, {Component, useState} from "react";
import axios from "axios";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import { ACCESS_TOKEN, FACEBOOK_AUTH_URL, GOOGLE_AUTH_URL } from "../Components/constants";
import googleLogo from "../Components/img/google-logo.png";
import facebookLogo from "../Components/img/fb-logo.png";
import {login} from "../Components/APIUtils";

const LoginContainer = styled.div`

`;

const SocialLogin = styled.div`
`;
const Google = styled.a``;
const Facebook = styled.a``;


export default class Login extends Component {

    componentDidMount() {
        if(this.props.location.state && this.props.location.state.error) {
            console.log("error!");
            this.props.history.replace( {
                pathname: this.props.location.pathname,
                state: {}
            });
        }
    }
    render() {
        if(this.props.authenticated) {
            return <Redirect to={{
                pathname: "/",
                state: { from: this.props.location}
            }} />;
        }

        return (<LoginContainer>
                <SocialLogin>
                    <Google href={GOOGLE_AUTH_URL}>
                        <img src={googleLogo} alt="Google"/>
                        Login with Google
                    </Google>
                    <Facebook href={FACEBOOK_AUTH_URL}>
                        <img src={facebookLogo} alt="Facebook" />
                        Login in with Facebook
                    </Facebook>
                </SocialLogin>
                <LocalLogin {...this.props} />
        </LoginContainer>);
    };


    

};

function LocalLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const loginRequest = Object.assign({},this.state);
        login(loginRequest).then(response => {
            localStorage.setItem(ACCESS_TOKEN, response.ACCESS_TOKEN);
            console.log("successfully logged in!");
            this.props.history.push("/");
        }).catch(error => {
            console.log("error break!");
        });

    }
    const handleChange = (e) => {
        var n = e.target.name;
        if (n== "email"){
            setEmail(e.target.value);
        }
        else{
            setPassword(e.target.value);
        }
    
    }
    return(<div>
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" value={email} onChange={handleChange} required />
            <input type="password" name="password" value={password} onChange={handleChange} required/>

        </form>
    </div>);

}
