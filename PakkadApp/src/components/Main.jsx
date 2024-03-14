import React , { useEffect , useState} from "react";
import HeaderMenu from "./HeaderMenu";
import CheckNpkContainer from "./CheckNpkContainer";
import { useAuth } from "./AuthContext.jsx";
import {  GetUserEmail , GetUserDocumentId, GetHistoryInfo} from "./FirestoreDB.jsx";

const Main = () => {
    const { user } =  useAuth();
    return(
        <>
            <HeaderMenu isLogin={user != null}/>           

            {user ? (
                <p>Welcome {user.email} !</p>
            ) : <p>You're not login</p>}
            <CheckNpkContainer/>      
        </>
    )
}

export default Main;