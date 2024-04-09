import React , { useState , useEffect } from "react";
import styled from 'styled-components';
import GoodImg from '../image/goodValue.png';
import BadImg from '../image/badValue.png';
import { GetPlotInfo, AddNpkToPlotHistory, GetPlotData,GetPlotDocByID, GetSensorNames ,calcNpkResultStatusMainPage, getSensorOfUser } from "./FirestoreDB.jsx";
import  {GetNpkFromRealtimeDB} from "./RealtimeDB.jsx";

import { useAuth } from "./AuthContext.jsx";

const Container = styled.div`
    width: 95%;
    margin: 0 auto;
    margin-top: 50px;
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
    max-width: 40%;
    min-width: 32%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const PlotSelect = styled.select`
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

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
    &:hover{
        background-color: #3b9c56;
        color: var(--subTextColor);
        /* box-shadow: inset 0 0 0 5px var(--mainColor); */
    }
`;
const AddNpkBtn = styled(BaseBtn)`
    color: var(--mainColor);
    box-shadow: inset 0 0 0 5px var(--mainColor);
    background-color: #F1F3F6;
    &:hover{
        background-color: #ffffff;
        color: #3b9c56;
        box-shadow: inset 0 0 0 5px #3b9c56;
    }
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
    max-width: 40%;
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


const  CheckNpkContainer = ({viewingPlotName}) => {
    const { user } = useAuth();

    const [plotList , setPlotList] = useState([]);
    const refreshPlotList = async () => {
        if (user) {
          const plots = await GetPlotInfo(user.email);
          const plotnames = plots.map((plot) => ({
            id: plot.id,
            name: plot.garden_name,
            sensor: plot.sensor,
            veg_name: plot.veg_name,
          }));
          plotnames.unshift({
            id: "donthavevalue",
            name: "",
            sensor: "",
            veg_name: "",
          });
          setPlotList(plotnames);
        }
      };
      useEffect(() => {
        refreshPlotList();
    }, [user]);

    const [selectPlot, setSelectedPlot] = useState('');
    const handlePlotChange = (event) => {
        setSelectedPlot(event.target.value);
    };
    
    // จัดการค่า NPK ดึงค่า แสดงค่า
    const [RgbToNPK, setRgbToNPK] = useState({
        NITROGEN: 0,
        PHOSPHORUS: 0,
        POTASSIUM: 0,
        date: new Date(),
    });
    const [npkStatus, setnpkStatus] = useState({
        NITROGEN: false,
        PHOSPHORUS: false,
        POTASSIUM: false,
    });
    const updateNPK = async() =>{
        try{
            const plotData = await GetPlotDocByID(user.email, selectPlot);
            const sensorIds = plotData.sensor;

            const getSensorNames = async (sensorId) => {
                const sensorData = await getSensorOfUser(user.email);
                const sensor = sensorData.find((sensor) => sensor.documentId === sensorId);
                return sensor ? sensor.name : null;
              };
            const sensorNames = await getSensorNames(sensorIds);

            const npkStatus = await calcNpkResultStatusMainPage(user.email,selectPlot,RgbToNPK.NITROGEN,RgbToNPK.PHOSPHORUS,RgbToNPK.POTASSIUM);
            const npkData = await GetNpkFromRealtimeDB(sensorNames, user.uid);
            const readingRed = npkData.nitrogen !== null ? npkData.nitrogen : 0;
            const readingGreen = npkData.phosphorus !== null ? npkData.phosphorus : 0;
            const readingBlue = npkData.potassium !== null ? npkData.potassium : 0;
            setRgbToNPK({
            NITROGEN: readingRed,
            PHOSPHORUS: readingGreen,
            POTASSIUM: readingBlue,
            date: new Date(),
            });
            setnpkStatus({
            NITROGEN: npkStatus.IsNitrogenStatusInRange,
            PHOSPHORUS: npkStatus.IsPhosphorusStatusInRange,
            POTASSIUM: npkStatus.IsPotassiumStatusStatusInRange,
            });
        } catch(error) {
            console.error('Error fetching sensor readings:', error);
        }
    }

    const npkValue =[ 
        {valueType: "Nitrogen", subValueType: "N", value: RgbToNPK.NITROGEN ,status : npkStatus.NITROGEN?GoodImg:BadImg},
        {valueType: "Phosphorus", subValueType: "P", value: RgbToNPK.PHOSPHORUS ,status : npkStatus.PHOSPHORUS?GoodImg:BadImg},
        {valueType: "Potassium", subValueType: "K", value: RgbToNPK.POTASSIUM ,status : npkStatus.POTASSIUM?GoodImg:BadImg},
    ]
    
    // บันทึกประวัติการตรวจ
    const recordData  = () => {
        if (selectPlot) {
            console.log('viewingPlotName:', selectPlot);
            console.log(RgbToNPK);
            AddNpkToPlotHistory(user.email, selectPlot, RgbToNPK);
            alert("Added to History.");
            console.log("recorded");
          } else if(selectPlot == "donthavevalue"){
            alert("กรุณาเลือกแปลงผักก่อนบันทึกข้อมูล");
          }
          else {
            alert("กรุณาเลือกแปลงผักก่อนบันทึกข้อมูล");
          }
    };
    const loginAlert  = () => {
        alert('You must login before record data!!!')
    };
    return(
        <Container>
            <InputContainer>
                <PlotSelectTitle>เลือกแปลงผัก</PlotSelectTitle>
                    <PlotSelect value={selectPlot} onChange={handlePlotChange}>
                    {plotList.map((plot, index) => (
                    <option key={index} value={plot.id}>
                        {plot.name}
                    </option>
                    ))}
                </PlotSelect>
                <CheckNpkBtn onClick={updateNPK}>ตรวจค่า NPK</CheckNpkBtn>
                { user != null 
                ? <AddNpkBtn onClick={recordData}>บันทึกค่า NPK</AddNpkBtn>
                : <AddNpkBtn onClick={loginAlert}>บันทึกค่า NPK</AddNpkBtn>}
                { user != null 
                ? ""
                :<div><LoginSpan>LOGIN</LoginSpan><Span>  เพื่อบันทึกค่า</Span></div>}
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