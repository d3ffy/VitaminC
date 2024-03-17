import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import userImg from '../image/user 1.png';
import padlockImg from '../image/padlock 1.png';
import HeaderMenu from "./HeaderMenu";

import { useNavigate } from 'react-router-dom'
import { getAuth, fetchSignInMethodsForEmail} from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {addUserToFirestore } from './FirestoreDB.jsx'


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
    padding: 5% 3% 3% 3%;
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
    height: 400px;
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
const InputConfirmBox = styled.div`
    display: flex;
    height: fit-content;
    border-bottom: 1px solid ${(props) => (props.confirmPasswordStatus ? "black" : "red")};
    padding: 10px 0 10px 0px;
`;
const InputPasswordBox = styled.div`
    display: flex;
    height: fit-content;
    border-bottom: 1px solid ${(props) => (props.passwordStatus ? "black" : "red")};
    padding: 10px 0 10px 0px;
`;
const InputLabel = styled.div`
    margin-top: 25px;
`;
const InputConfirmAlert = styled.div`
    margin-top: 5px;
    color: red;
`;
const InputPasswordAlert = styled.div`
    margin-top: 5px;
    color: red;
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
    margin-top: 30px;
`;

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordStatus, setPasswordStatus] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordStatus, setConfirmPasswordStatus] = useState(true);
    let navigate = useNavigate(); 

    const setPasswordHandle = (e) =>{
        setPassword(e.target.value);
        if(password.length < 5){
            setPasswordStatus(false);
        }
        if(password.length >= 5){
            setPasswordStatus(true);
        }
    };
    
    useEffect(() => {
        if(password !== confirmPassword){
            setConfirmPasswordStatus(false);
        }
        if(password === confirmPassword){
            setConfirmPasswordStatus(true);
        }
    }, [confirmPassword, setPasswordHandle, email]);

    const handleRegister = async () => {
        const auth = getAuth();
    
        try {
            if (password !== confirmPassword) {
                alert("Password and confirm password do not match");
                return;
            }
    
            if (password.length < 5) {
                alert("Password should be at least 6 characters");
                return;
            }
    
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    
            if (signInMethods.length > 0) {
                alert("This email is already in use. Please use another email.");
            } else {
                try {
                    await createUserWithEmailAndPassword(auth, email, password);
                    await addUserToFirestore(email);
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    navigate('/');
                    console.log("Registration successful");
                } catch (error) {
                    console.error("Registration error:", error);
                    alert("This email is already in use. Please use another email.");
                }
            }
        } catch (error) {
            console.error(error);
        }
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
                    <InputPasswordBox passwordStatus={passwordStatus}>
                        <InputIcon src={padlockImg}></InputIcon>
                        <input
                            placeholder="PASSWORD"
                            type="password"
                            onChange={(e) => setPasswordHandle(e)}
                            className="custom-input"
                        />
                    </InputPasswordBox>
                    {!passwordStatus ?(<InputPasswordAlert>Password should be at least 6 characters</InputPasswordAlert>)
                    :("")}

                    <InputLabel>CONFIRM PASSWORD</InputLabel>
                    <InputConfirmBox confirmPasswordStatus={confirmPasswordStatus}>
                        <InputIcon src={padlockImg}></InputIcon>
                        <input
                            placeholder="CONFIRM PASSWORD"
                            type="password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="custom-input"
                        />
                    </InputConfirmBox>
                    {!confirmPasswordStatus ?(<InputConfirmAlert>Your Password not equal Confirm Password</InputConfirmAlert>)
                    :("")}
                </FormContainer>
                <LoginBtn type="button" onClick={handleRegister}>Register</LoginBtn>
            </Card>
        </Container>
        </>
    )
}

export default Register;