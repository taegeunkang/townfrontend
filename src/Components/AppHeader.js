import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import styled from "styled-components";
import "./AppHeader.css";

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  background-color: white;
  border-bottom: 0.3px solid black;
`;
const Home = styled.div`
  display: flex;
  width: 33.3%;
  justify-content: center;
  align-items: center;
  padding-left: 1rem;
`;
const MenuList = styled.ul`
  list-style: none;
  display: flex;

  justify-content: flex-start;
  align-items: center;
  width: 33.3%;
`;
const Menu = styled.li`
  margin-right: 1rem;
`;
const Login = styled.div`
  text-decoration: none;
`;
const Logout = styled.div``;
const ProfileImage = styled.img`
  width: 2rem;
  border-radius: 25px;
`;

const Space = styled.div`
  width: 33.3%;
  color: transparent;
`;
export default function AppHeader(props) {
  const history = useHistory();
  const handleLogout = () => {
    props.onLogout();
    history.push("/login");
  };
  return (
    <Header>
      {props.authenticated ? (
        <>
          <MenuList>
            <Menu>
              <Link class="menu_style" to="/profile">
                <ProfileImage
                  src={props.currentUser.imageUrl}
                  alt="profileImage"
                ></ProfileImage>
              </Link>
            </Menu>

            <Menu>
              <Logout onClick={handleLogout}>Logout</Logout>
            </Menu>
          </MenuList>
          <Home>
            <Link class="menu_style" to="/">
              Home
            </Link>
          </Home>
          <Space>.</Space>
        </>
      ) : (
        <>
          <Link class="menu_style" to="/">
            Home
          </Link>
          <MenuList>
            <Menu>
              <Link class="menu_style" to="/login">
                <Login>Login</Login>
              </Link>
            </Menu>
            <Menu>
              <Link class="menu_style" to="/signup">
                Sign up
              </Link>
            </Menu>
          </MenuList>
          <div>.</div>
        </>
      )}
    </Header>
  );
}
