import React from "react";
import { GlobalStyle } from "./GlobalStyles";
import HeaderMenu from "./HeaderMenu";
import Test from "./Test";
import RealtimeDB from "./RealtimeDB";
import FirestoreDB from "./FirestoreDB.jsx";

function App(){
    return(
        <>
            <GlobalStyle />
            <HeaderMenu />
            <Test/>
            <RealtimeDB/>
            <FirestoreDB/>
        </>
    );
};

export default App;
