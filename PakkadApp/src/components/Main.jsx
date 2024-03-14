import React , { useEffect , useState} from "react";
import HeaderMenu from "./HeaderMenu";
import CheckNpkContainer from "./CheckNpkContainer";
import { useAuth } from "./AuthContext.jsx";
import {  GetUserEmail , GetUserDocumentId} from "./FirestoreDB.jsx";

const Main = () => {
    const { user } =  useAuth();
    // GetUserEmail();
    // GetUserDocumentId(user.email);
    // useEffect(() => {
    //     const fetchData = async () => {
    //       if (user) {
    //         const plotData = await GetUserDocumentId(user.email);
    //         console.log(plotData);
    //       }
    //     };
    
    //     fetchData();
    //   }, [user]);

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