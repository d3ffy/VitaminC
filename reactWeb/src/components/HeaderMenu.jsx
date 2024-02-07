import React from "react";
import PAKKAD from '../image/PAKKAD.png';
import styled from 'styled-components';

const Container = styled.div`
    background-color: var(--mainColor);
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 125px;
`;

const BaseBtn = styled.span`
    color: var(--subTextColor);
    font-size: 1.5rem;
    font-weight: bold;
    padding: 0 5rem;
    height: 100%;
    display: flex;
    align-items: center;
`
const LinkBtn = styled(BaseBtn)``;

const LoginBtn = styled(BaseBtn)`
    border: 4px solid var(--subTextColor);
    border-radius: 5px;
    padding: 26px 50px;
    height: 81px;
    margin-right: 20px;
`;
const LogoImage = styled.img`
    height: 29px;
    width: auto;
    padding-left: 2rem;
`


const BtnContainer = styled.div`
    height: 100%;
    align-items: center;
    display: flex;
`

const HeaderMenu = () => {
    return(
        <Container>
            <LogoImage src={PAKKAD} alt="PAKKAD LOGO" />
            <BtnContainer>
                <LinkBtn>HOME</LinkBtn>
                <LinkBtn>HISTORY</LinkBtn>
                <LoginBtn>LOGIN</LoginBtn>
            </BtnContainer>
        </Container>
    )
}

export default HeaderMenu;