import HeaderMenu from "./HeaderMenu";
import React from "react";
import styled from 'styled-components';
import badValue from '../image/badValue.png';
import cross from '../image/cross.png';

const Container = styled.div`
    padding-top: 8vh;
    margin: 0 auto;
    width: 90%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    row-gap: 5svh; 
    column-gap:  4.8vw;

`;
const Box = styled.div`
    height: 16vh;
    width: 26.7vw;
    display: flex;
    background-color: var(--subColor);
    padding: 20px;
    border-radius: 8px;
`;
const PlatImg = styled.img`
    height: 11.4vh;
    width: auto;
    margin-right: 2vw;
`;
const PlantTitle = styled.div`
    font-size: 24px;
`;
const PlantTestDate = styled.div`
    font-size: 20px;
    color: #2D2D2D;
`;
const AddPlotBtn = styled.div`
    position: absolute;
    right: 3.2vw;
    bottom: 5vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #D9D9D9;
    height: 10.8vh;
    width: 10.8vh;
    border-radius: 100rem;
`;
const AddImg = styled.img`
    height: 6.2vh;
    width: auto;
`;

const  PlotList = () => {
    const plotDB = [
        {img: "../path/img.png", name: "แปลงผักกาดคอส" ,lastestTest: "ตรวจล่าสุด 3/10/20"},
        {img: "../path/img.png", name: "plotName" ,lastestTest: "ตรวจล่าสุด " + new Date()},
        {img: "../path/img.png", name: "plotName" ,lastestTest: "ตรวจล่าสุด " + new Date()},
        {img: "../path/img.png", name: "plotName" ,lastestTest: "ตรวจล่าสุด " + new Date()},
        {img: "../path/img.png", name: "plotName" ,lastestTest: "ตรวจล่าสุด " + new Date()},
        {img: "../path/img.png", name: "plotName" ,lastestTest: "ตรวจล่าสุด " + new Date()},
    ]

    return(
        <>
            <HeaderMenu />
            <Container>
                {plotDB.map((plot, index) => (
                    <Box key={index}>
                        <PlatImg src={badValue}></PlatImg>
                        <div>
                            <PlantTitle>{plot.name}</PlantTitle>
                            <PlantTestDate>{plot.lastestTest}</PlantTestDate>
                        </div>
                    </Box>
                ))}
            </Container>
            <AddPlotBtn><AddImg src={cross}></AddImg></AddPlotBtn>
        </>
    )
}

export default PlotList;