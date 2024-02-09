import React , { useState } from "react";
import styled from 'styled-components';
import GoodImg from '../image/goodValue.png';
import BadImg from '../image/badValue.png';

const Container = styled.div`
    width: 95%;
    margin: 0 auto;
    border-radius: 40px;
    display: flex;
    background-color: #F1F3F6;
    justify-content: space-around;
    padding: 50px 0px;
`;
const PlotSelectTitle = styled.div`
    position: absolute;
    left: 30px;
    top: 0;
    font-size: 24px;
    font-weight: bold;
`;
const InputContainer = styled.div`
    position: relative;
    width: 40%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const PlotSelect = styled.select`
    width: 100%;
    border-radius: 100rem;
    border: none;
    min-height: 80px;
    font-size: 24px;
    padding: 5%;
    text-align: center;
    margin-bottom: 80px;
    margin-top: 50px;
`;
const BaseBtn = styled.button`
    width: 100%;
    border-radius: 100rem;
    border: none;
    min-height: 80px;
    font-size: 38px;
    font-weight: bold;
    margin-bottom: 30px;
`;
const CheckNpkBtn = styled(BaseBtn)`
    color: var(--subTextColor);
    background-color: var(--mainColor);
`;
const AddNpkBtn = styled(BaseBtn)`
    color: var(--mainColor);
    box-shadow: inset 0 0 0 5px var(--mainColor);
    background-color: #F1F3F6;
`;
const Span = styled.span`
    color: #818181;
    font-size: 24px;
`;
const LoginSpan = styled(Span)`
    text-decoration: underline;
`
const NPKContainer = styled.div`
    min-width: max-content;
    width: 40%;
`
const NPKCard = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: var(--subTextColor);
    border-radius: 50px;
    width: 100%;
    padding: 20px 50px;
    justify-content: space-between;
    margin-bottom: 30px;
    &:last-child {
        margin-bottom: 0px;
    }
`
const TestValue = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-right: 30px;
    width: max-content;
    &:last-child {
        margin-right: 0;
    }
`
const ValueTitle = styled.span`
    width: max-content;
    font-size: 1.5rem;
    margin-bottom: 10px;
`
const Value = styled.span`
    font-size: 3rem;
`
const ValueImg = styled.img`
    margin-bottom: 5px;
`


const  CheckNpkContainer = () => {
    // เอาชื่อแปลงผักจาก database มาแทน
    // setPlotList ตอน database มีการอัปเดคเว็บจะได้อัปเดตข้อมูลตาม
    const [plotList , setPlotList] = useState(
        ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France']
    );
    const [selectPlot, setSelectedPlot] = useState('');

    const handlePlotChange = (event) => {
        setSelectedPlot(event.target.value);
    };

    // ดึงค่าจาก realtime database มาใส่ใน value: 20
    const npkValue =[ 
        {valueType: "Nitrogen", subValueType: "N", value: 20 ,status : GoodImg},
        {valueType: "Phosphoru", subValueType: "P", value: 22 ,status : BadImg},
        {valueType: "Potassium", subValueType: "K", value: 324.2 ,status : GoodImg},
    ]
    return(
        <Container>
            <InputContainer>
                <PlotSelectTitle>เลือกแปลงผัก</PlotSelectTitle>
                    <PlotSelect value={selectPlot} onChange={handlePlotChange}>
                    {plotList.map((plot, index) => (
                    <option key={index} value={plot}>
                        {plot}
                    </option>
                    ))}
                </PlotSelect>
                <CheckNpkBtn>ตรวจค่า NPK</CheckNpkBtn>
                <AddNpkBtn>บันทึกค่า NPK</AddNpkBtn>
                <div><LoginSpan>LOGIN</LoginSpan><Span>  เพื่อบันทึกค่า</Span></div>
            </InputContainer>
            <NPKContainer>
                {npkValue.map((valueData, index) => (
                    <NPKCard key={index}>
                        <TestValue>
                            <ValueTitle>{valueData.valueType}</ValueTitle>
                            <Value>{valueData.subValueType}</Value>
                        </TestValue>
                        <TestValue>
                            <ValueTitle>ค่าที่วัดได้</ValueTitle>
                            <Value>{valueData.value}</Value>
                        </TestValue>
                        <TestValue>
                            <ValueTitle>ความเหมาะสม</ValueTitle>
                            <ValueImg src={valueData.status}></ValueImg>
                        </TestValue>
                    </NPKCard>
                ))}
            </NPKContainer>
        </Container>
    )
}

export default CheckNpkContainer;