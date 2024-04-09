import React , { useEffect , useState} from "react";
import HeaderMenu from "./HeaderMenu";
import CheckNpkContainer from "./CheckNpkContainer";
import { useAuth } from "./AuthContext.jsx";
import {  GetUserEmail , GetUserDocumentId, getSensorOfUser,GetPlotData} from "./FirestoreDB.jsx";
import { GetNpkFromRealtimeDB, getDatafromRealTimeDB } from "./RealtimeDB.jsx";

const Main = () => {
    const { user } =  useAuth();
    
    // useEffect(() => {
    //     const fetchData = async () => {
    //     try {
    //         console.log("test");
    //         const database = await GetNpkFromRealtimeDB('sensor1');
    //         console.log('Database:', database);
            
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    //     };

    //     fetchData();
    // }, []);

    return(
        <>
            <HeaderMenu isLogin={user != null}/>           
            <CheckNpkContainer/>      
        </>
    )
}

export default Main;