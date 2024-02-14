import React from "react";
import { GlobalStyle } from "./GlobalStyles";
import {  Routes , Route } from 'react-router-dom';

import Login from "./Login.jsx";
import History from "./History.jsx";
import Main from "./Main.jsx";
import Register from "./Register.jsx";
import { AuthProvider } from "./AuthContext.jsx";


function App(){
    return(
        <>
        <GlobalStyle />

        <AuthProvider>
            <Routes>
                <Route exact path="/" element={<Main/>}/>
                <Route exact path="/login" element={<Login/>}/>
                <Route exact path="/history" element={<History/>}/>
                <Route exact path="/register" element={<Register/>}/>
            </Routes>
        </AuthProvider>
        </>
    );
};

export default App;
