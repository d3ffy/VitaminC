import React from "react";
import { GlobalStyle } from "./GlobalStyles";

import HeaderMenu from "./HeaderMenu";
import RealtimeDB from "./RealtimeDB";
import FirestoreDB from "./FirestoreDB.jsx";

import Login from "./Login.jsx";
import Infomation from "./Infomation.jsx";
import Main from "./Main.jsx";
import {  Routes , Route } from 'react-router-dom';

function App(){
    return(
        <>
        <GlobalStyle />

        <Routes>
            <Route exact path="/" element={<Main/>}/>
            <Route exact path="/login" element={<Login/>}/>
            <Route exact path="/infomation" element={<Infomation/>}/>
        </Routes>
        </>
    );
};

export default App;
