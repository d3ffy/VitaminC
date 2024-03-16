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
            <CheckNpkContainer/>      
        </>
    )
}

export default Main;