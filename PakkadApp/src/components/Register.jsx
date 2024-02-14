import React, { useState } from "react";
import styled from 'styled-components';
import userImg from '../image/user 1.png';
import padlockImg from '../image/padlock 1.png';

import HeaderMenu from "./HeaderMenu";

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'


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

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const auth = getAuth();
    let navigate = useNavigate(); 

    const handleLogin = () => {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const loggedInUser = userCredential.user;
          alert(`You have logged in with ${loggedInUser.email}`);
          console.log(loggedInUser);
          navigate('/')
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert('Incorrect Username or Password!');
          console.error('Login error:', errorCode, errorMessage);
        });
    };

    return(
        <>
        <HeaderMenu />
        <Container>  
            <Card>
                <Title>REGISTER</Title>
                <FormContainer>
                    <InputLabel>USERNAME</InputLabel>
                    <InputBox>
                        <InputIcon src={userImg}></InputIcon>
                        <input
                            placeholder="EMAIL"
                            type="text"
                            className="custom-input"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </InputBox>
                    <br></br>
                    <InputLabel>PASSWORD</InputLabel>
                    <InputBox>
                        <InputIcon src={padlockImg}></InputIcon>
                        <input
                            placeholder="PASSWORD"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="custom-input"
                        />
                    </InputBox>

                    <InputLabel>CONFIRM PASSWORD</InputLabel>
                    <InputBox>
                        <InputIcon src={padlockImg}></InputIcon>
                        <input
                            placeholder="CONFIRM PASSWORD"
                            type="confirmPassword"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="custom-input"
                        />
                    </InputBox>
                </FormContainer>
                <LoginBtn type="button" onClick={handleLogin}>Register</LoginBtn>
            </Card>
        </Container>
        </>
    )
}

export default Register;