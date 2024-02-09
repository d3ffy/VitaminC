import React from "react";
import styled from 'styled-components';
import userImg from '../image/user 1.png';
import padlockImg from '../image/padlock 1.png';

import HeaderMenu from "./HeaderMenu";

const Container = styled.div`
    position: absolute;
    padding-top: 10vh;
    top: 0px;
    background-color: #F1F3F6;
    width: 100vw;
    min-height: 100vh;
    height: max-content;
`;
const Card = styled.div`
    background-color: var(--subTextColor);
    width: 100%;
    max-width: 625px;
    height: max-content;
    margin: 0 auto;
    margin-top: 30px;
    border-radius: 20px;
    box-shadow: 0px 0px 30px -7px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5% 3% 10% 3%;
`;
const InputIcon = styled.img`
    height: 34px;
    width: auto;
    margin-right: 30px;
`;
const FormContainer = styled.form`
    display: flex;
    justify-content: start;
    flex-direction: column;
    width: 100%;
`;
const Title = styled.span`
    font-size: 2rem;
    font-weight: bold;
`
const InputBox = styled.div`
    display: flex;
    height: fit-content;
    border-bottom: 1px solid black;
    padding: 10px 0 10px 0px;
`;
const InputLabel = styled.div`
    margin-top: 25px;
`;
const LoginBtn = styled.button`
    width: 100%;
    height: 63px;
    text-align: center;
    border: none;
    border-radius: 100rem;
    color: var(--subTextColor);
    font-size: 20px;
    background-color: var(--mainColor);
    margin-top: 40px;
`;
const SingupSpan = styled.span`
    margin-top: 15px;
    font-size: 14px;
    color: #818181;
`;



const Login = () => {
    return(
        <>
        <HeaderMenu />
        <Container>  
            <Card>
                <Title>LOGIN</Title>
                <FormContainer>
                    <InputLabel>USERNAM</InputLabel>
                    <InputBox>
                        <InputIcon src={userImg}></InputIcon>
                        <input
                            type="text"
                            defaultValue="password"
                            className="custom-input"
                        />
                    </InputBox>

                    <InputLabel>PASSWORD</InputLabel>
                    <InputBox>
                        <InputIcon src={padlockImg}></InputIcon>
                        <input
                            type="password"
                            defaultValue="password"
                            onChange={(e) => console.log(e.target.value)}
                            className="custom-input"
                        />
                    </InputBox>
                </FormContainer>
                <LoginBtn type="button" >Login</LoginBtn>
                <SingupSpan>OR Sign Up</SingupSpan>
            </Card>
        </Container>
        </>
    )
}

export default Login;