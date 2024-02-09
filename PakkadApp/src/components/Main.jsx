import React, { useState } from "react";

import HeaderMenu from "./HeaderMenu";
import RealtimeDB from "./RealtimeDB";
import FirestoreDB from "./FirestoreDB.jsx";
import CheckNpkContainer from "./CheckNpkContainer";


const Main = () => {
    const [isLogin , setIsLogin] = useState(false);

    const toggleLogin = () => {
        setIsLogin(!isLogin);
    }

    return(
        <>
            <HeaderMenu isLogin={isLogin}/>
            <RealtimeDB/>
            <FirestoreDB/>
            <button onClick={toggleLogin}>Click to Login and Logout[Test]</button>
            <CheckNpkContainer/>
        </>
    )
}

export default Main;