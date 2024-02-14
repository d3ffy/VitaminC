import React from "react";
import PAKKAD from '../image/PAKKAD1.png';
import logoutDropDown from '../image/logoutDropDown.png';
import settingDropDown from '../image/settingDropDown.png';
import userDropDown from '../image/userDropDown.png';
import styled from 'styled-components';
import { Link } from "react-router-dom"; 

import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'

const Container = styled.div`
    position: fixed;
    background-color: #FFFFFF;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 10vh;
    width: 100%;
    top: 0px;
    z-index: 100;
    box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.25);
`;

const BaseBtn = styled.span`
    color: var(--mainColor);
    font-size: 1.5rem;
    font-weight: bold;
    padding: 0 5rem;
    height: 100%;
    display: flex;
    align-items: center;
`
const LinkBtn = styled(BaseBtn)`
`;
const LoginBtn = styled(BaseBtn)`
    border: 0.5vh solid #AE4F4D;
    border-radius: 5px;
    padding: 1.62rem 2rem;
    height: 1vh;
    margin-right: 1.25rem;
`;
const DropDownBtn = styled(BaseBtn)`
    width: 100%;
    padding: 14px 0 14px 20px;
    font-size: 20px;
    font-weight: 400;
    color: black;
`
const DropDownImg = styled.img`
    margin-right: 20px;
    height: 30px;
    width: 30px;
`
const LogoImage = styled.img`
    height: 1.8rem;
    width: auto;
    padding-left: 2rem;
`
const BtnContainer = styled.div`
    height: 100%;
    align-items: center;
    display: flex;
`
const StyledLink = styled(Link)`
    text-decoration: none;
    color: white;
`;
const DropdownMenu = styled.div`
    width: 100%;
    display: none;
    flex-direction: column;
    align-items: start;
    position: absolute;
    top: 100%; 
    left: 0;
    background-color: var(--subColor);
    border-radius: 8px;
    padding: 10px;
    z-index: 1000;
`;
const DropdownContainer = styled.div`
    height: 100%;
    position: relative;

    &:hover  {
        ${DropdownMenu} {
            display: flex;
        }
    }
`;
const HeaderMenu = ({isLogin}) => {
    let navigate = useNavigate(); 

    const auth = getAuth()
    const handleLogout = () => {
        signOut(auth)
        .then(() => {
            alert('Logout Successfully!')
            navigate('')
        })
        .catch((error) =>{
            console.log(error)
            
        })
    }
    
    return(
        <Container>
            <LogoImage src={PAKKAD} alt="PAKKAD LOGO" />
            <BtnContainer>
                <StyledLink to="/"><LinkBtn>HOME</LinkBtn></StyledLink>
                <StyledLink to="/history"><LinkBtn>HISTORY</LinkBtn></StyledLink>
                {isLogin ? (
                    <>
                        <DropdownContainer>
                            <StyledLink to="/"><LinkBtn>PROFILE</LinkBtn></StyledLink>
                            <DropdownMenu>
                                <StyledLink to="/"><DropDownBtn><DropDownImg src={userDropDown}></DropDownImg>Username</DropDownBtn></StyledLink>
                                <StyledLink to="/"><DropDownBtn><DropDownImg src={settingDropDown}></DropDownImg>Setting</DropDownBtn></StyledLink>
                                <StyledLink to="/"><DropDownBtn onClick={handleLogout}><DropDownImg src={logoutDropDown}></DropDownImg>Log Out</DropDownBtn></StyledLink>
                            </DropdownMenu>
                        </DropdownContainer>
                    </>
                ) : (
                    <StyledLink to="/login"><LoginBtn>LOGIN</LoginBtn></StyledLink>
                )}
            </BtnContainer>
        </Container>
    )
}

export default HeaderMenu;