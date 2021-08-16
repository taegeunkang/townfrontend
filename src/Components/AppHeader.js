import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import "./AppHeader.css";
import {GiHamburgerMenu} from "react-icons/gi";
import {BiSearchAlt} from "react-icons/bi";
import {ImPencil2} from "react-icons/im";
const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: rgba(255,255,255,1);
  border-bottom: 0.3px solid black;
  z-index: 100;
  
`;

const MenuList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: row;
  margin: 0px 0px;
  padding: 0px 0px;
  align-items: center;
  width: 100%;
`;
const Menu = styled.li`
  width: 33.3%;
  display: flex;
  font-weight: 600;
  gap:1rem;

  justify-content: center;
  align-items: center;
`;
const Login = styled.div`
  text-decoration: none;
`;
const Logout = styled.div``;
const ProfileImage = styled.img`
  width: 2rem;
  border-radius: 25px;
`;
const HamburgerMenu = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  
`;
const BurgerList = styled.ul`
  display: flex;
  gap: 0.5rem;
  width: 100%;
  font-size: 1rem;
  flex-direction: column;
  list-style: none;
  margin: 0px 0px;
  padding:0px 0px;
`;
const Burgers = styled.li`
  text-align:center;
  width: 100%;
  border-top: 1px solid black;
`;
export default function AppHeader(props) {
  const history = useHistory();
  const [burger, setBurger] = useState(false);
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
              <Link  to="/profile">
                <ProfileImage
                  src={props.currentUser.imageUrl}
                  alt="profileImage"
                ></ProfileImage>
              </Link>
              <GiHamburgerMenu onClick={()=> setBurger(!burger)} size="1.5rem" />
            </Menu>

            <Menu>
              <Link class="menu_style" to="/">
                Town
              </Link>
            </Menu>
            <Menu>
            <BiSearchAlt size="1.6rem" />
              <Link class="menu_write" to="/write" >
              <ImPencil2 size="1.4rem" />
              </Link>
            
            </Menu>
          </MenuList>
          {burger && 
          (<HamburgerMenu>
            <BurgerList>
              <Burgers>
            <Logout onClick={handleLogout}>Logout</Logout>
            </Burgers>
            <Burgers>
            <Logout onClick={handleLogout}>Logout</Logout>
            </Burgers>
            <Burgers>
            <Logout onClick={handleLogout}>Logout</Logout>
            </Burgers>
            <Burgers>
            <Logout onClick={handleLogout}>Logout</Logout>
            </Burgers>
            </BurgerList>
          </HamburgerMenu>
          )}
        </>
      ) : (
        <>
          <MenuList>
            <Menu>
              <Link class="menu_loginout" to="/login">
                <Login>Login</Login>
              </Link>
              <Link class="menu_loginout" to="/signup">
                Sign up
              </Link>
            </Menu>
            <Menu>
              <Link class="menu_style" to="/">
                Town
              </Link>
            </Menu>
            <Menu>
             <div></div>
            </Menu>
           
          </MenuList>
          
        </>
      )}
    </Header>
  );
}
