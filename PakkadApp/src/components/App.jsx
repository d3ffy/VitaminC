import React from "react";
import { GlobalStyle } from "./GlobalStyles";
import {  Routes , Route } from 'react-router-dom';

import Login from "./Login.jsx";
import History from "./History.jsx";
import Main from "./Main.jsx";

function App(){
    return(
        <>
        <GlobalStyle />

        <Routes>
            <Route exact path="/" element={<Main/>}/>
            <Route exact path="/login" element={<Login/>}/>
            <Route exact path="/history" element={<History/>}/>
        </Routes>
        </>
    );
};

export default App;
