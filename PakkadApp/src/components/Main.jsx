import React from "react";

import HeaderMenu from "./HeaderMenu";
import RealtimeDB from "./RealtimeDB";
import FirestoreDB from "./FirestoreDB.jsx";
import CheckNpkContainer from "./CheckNpkContainer";

import { useAuth } from "./AuthContext.jsx";
const Main = () => {
    const { user } = useAuth()
    return(
        <>
            <HeaderMenu isLogin={user != null}/>           
            <RealtimeDB/>
            <FirestoreDB/>

            {user ? (
                <p>Welcome {user.email} !</p>
            ) : <p>You're not login</p>}
            <CheckNpkContainer/>      
        </>
    )
}

export default Main;