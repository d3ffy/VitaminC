import React from "react";
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import HeaderMenu from "./HeaderMenu";
import RealtimeDB from "./RealtimeDB";
import FirestoreDB from "./FirestoreDB.jsx";


const Main = () => {
    return(
        <>
            <HeaderMenu />
            <RealtimeDB/>
            <FirestoreDB/>
            <Link to="/login">Routing Test</Link>
        </>
    )
}

export default Main;