import React from "react";
import PAKKAD from '../image/PAKKAD1.png';
import styled from 'styled-components';
import { Link } from "react-router-dom"; 

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

const HeaderMenu = ({isLogin}) => {

    return(
        <Container>
            <LogoImage src={PAKKAD} alt="PAKKAD LOGO" />
            <BtnContainer>
                <StyledLink to="/"><LinkBtn>HOME</LinkBtn></StyledLink>
                <LinkBtn>HISTORY</LinkBtn>
                {isLogin ? (
                    <StyledLink to="/"><LinkBtn>PROFILE</LinkBtn></StyledLink>
                ) : (
                    <StyledLink to="/login"><LoginBtn>LOGIN</LoginBtn></StyledLink>
                )}
            </BtnContainer>
        </Container>
    )
}

export default HeaderMenu;