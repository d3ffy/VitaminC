import React, { useState } from 'react';
import styled from 'styled-components';
import HeaderMenu from "./HeaderMenu";
import BadValue from "../image/badValue.png";
import goodValue from "../image/goodValue.png";
import pencil from "../image/pencil.png";

import { useAuth } from "./AuthContext.jsx";
import { Link } from 'react-router-dom';

const SearchBoxContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 21.6vw;
    height: 80vh;
    /* padding-left: 3.2vw; */
    border-right:1px solid black ;
    font-size: 16px;
    margin: 5vh 0px;
`;
const SearchBox = styled.input`
    width: 15vw;
    height: 2.9vh;
    border: 3px solid #C1C1C1;
    border-radius: 10rem;
    padding: 2vh 0;
    padding-left: 1vw;
    font-size: 16px;
    margin-bottom: 4vh;
    margin-left: 3.2vw;
`;
const AddPlotBtn = styled.div`
    padding-left: 3.2vw;
    margin-bottom: 2vh;
    align-items: center;
    height: 5.38vh;
`;
const PlotSection = styled.div`
    padding-left: 3.2vw;
    height: 5.38vh;
    display: flex;
    align-items: center;
`;
const PlotSectionViewing = styled(PlotSection)`
    background-color: #D9D9D9;
`;
const AddPlotBG = styled.div`
    position: absolute;
    top: 0px;
    background-color: rgba(217,217,217,0.50);
    width: 100vw;
    height: 100vh;
    z-index: 2;
`;

// UI list แสดงแปลงผักฝั่งซ้าย
const LeftHistoryBar = () => {
    // State สำหรับเก็บค่าคำค้นหา
    const [searchTerm, setSearchTerm] = useState('');

    // State plot ที่กำลังเปิดอยู่
    const [viewingPlot, setViewingPlot] = useState('1dknhaw9ql1');
    const handleClick = (id) => {
        setViewingPlot(id);
      };

    // State สำหรับ list plot
  const [nameList, setNameList] = useState([
    {name: 'แปลงผักกาด1', id: '1dknhaw9ql1'},
    {name: 'แปลงผักกาด2', id: '2dknhaw9ql1'},
    {name: 'แปลงผักกาด3', id: '3dknhaw9ql1'},
    {name: 'แปลงผักกาด4', id: '5dknhaw9ql1'},
    {name: 'แปลงผักกาด5', id: '6dknhaw9ql1'},
  ]);
    
  // ฟังก์ชั่นเพื่อกรองรายการตามคำค้นหา
  const filteredList = nameList.filter(plot =>
    plot.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [showAddPlotBox , setShowAddPlotBox] = useState(false);

  const showPlotBox = () =>{
    setShowAddPlotBox(!showAddPlotBox);
  }

    return(
        <>
            <SearchBoxContainer>
                <SearchBox
                        type="text"
                        placeholder="ค้นหาแปลงผัก..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                <AddPlotBtn onClick={showPlotBox}>add new plot</AddPlotBtn>
                

                {filteredList.map((plot, index ) => ( 
                    plot.id === viewingPlot ? (
                    <PlotSectionViewing onClick={() => handleClick(plot.id)} key={index}>{plot.name}</PlotSectionViewing>
                ) : (
                    <PlotSection onClick={() => handleClick(plot.id)} key={index}>{plot.name}</PlotSection>)
                ))}
            </SearchBoxContainer>
            {showAddPlotBox ? <><AddPlotBG onClick={showPlotBox}></AddPlotBG>
                                    <AddPlotBox /></>: ""}
        </>
    )
}

const AddPlotBtnContainer = styled.div`
    position: absolute;
    padding-top: 10vh;
    top: 0px;
    width: 100vw;
    min-height: 100vh;
    height: max-content;
    z-index: 3;
`;
const Card = styled.div`
    position: fixed;
    background-color: var(--subTextColor);
    width: 100%;
    max-width: 625px;
    height: max-content;
    top: 50%;
    right: 20%;
    transform: translate(-50%, -50%);
    margin-top: 30px;
    border-radius: 20px;
    box-shadow: 0px 0px 30px -7px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5% 3% 10% 3%;
    z-index: 3;
`;
const FormContainer = styled.form`
    display: flex;
    justify-content: start;
    flex-direction: column;
    width: 100%;
`;
const Title = styled.span`
    font-size: 2rem;
    font-weight: bold;
`
const InputBox = styled.div`
    display: flex;
    height: fit-content;
    border-bottom: 1px solid black;
    padding: 10px 0 10px 0px;
`;
const InputLabel = styled.div`
    margin-top: 25px;
`;
const LoginBtn = styled.button`
    width: 100%;
    height: 63px;
    text-align: center;
    border: none;
    border-radius: 100rem;
    color: var(--subTextColor);
    font-size: 20px;
    background-color: var(--mainColor);
    margin-top: 40px;
`;
const PictureBtn = styled(LoginBtn)`
    background-color: transparent;
    color: var(--mainColor);
    box-shadow: inset 0 0 0px 3px var(--mainColor);
`
const SelectBox = styled.select`
    display: flex;
    height: fit-content;
    border: none;
    border-bottom: 1px solid black;
    padding: 10px 0 10px 0px;
`;

const AddPlotBox = () => {
    const [sensorList , setSensorList] = useState(
        ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France']
    );
    const [selectSensor, setSelectSensor] = useState('');
    const handleSensorChange = (event) => {
        setSelectSensor(event.target.value);
    };
    return(
        <>
            <Card>
                <Title>เพิ่มแปลงผัก</Title>
                <FormContainer>
                    <InputLabel>ชื่อแปลง</InputLabel>
                    <InputBox>                       
                        <input
                            placeholder="Plot name"
                            type="text"
                            className="custom-input"
                        />
                    </InputBox>

                    <InputLabel>อุปกรณ์</InputLabel>
                        <SelectBox value={selectSensor} onChange={handleSensorChange}>
                                    {sensorList.map((sensor, index) => (
                                    <option key={index} value={sensor}>
                                        {sensor}
                                    </option>
                                    ))}
                    </SelectBox>
                </FormContainer>
                <PictureBtn type="button" >เพิ่มรูปภาพ</PictureBtn>
                <LoginBtn type="button" >ยืนยัน</LoginBtn>
            </Card>
        </>
    )
}

const RightContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    margin-top: 7vh;
    min-width: max-content;
    width: 70.19vw;
`;
const PlotInformation = styled.div`
    display: flex;
`;
const PlotTitle = styled.input`
    font-size: 48px;
    font-weight: bold;
    margin-bottom: 6.6vh;
    width: max-content;
    border: none;
    outline: none;
`;
const PlotDetail = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;
const InfoCard = styled.div`
    &:last-child{
        margin-left: 7.3vw;
    }
`;
const PlotImage = styled.img`
    width: 12.9vw;
    height: 12.9vw;
    margin-right: 4vw;
    background-color: #C1C1C1;
    border-radius: 20px;
`;
const PlotInfo = styled.div`
    display:flex ;
    flex-direction: row;
`;
const Plottype = styled.div`
    font-size:  24px;
`;
const PlotSelect = styled.select`
    font-size:  20px;
    border: 4px solid #C1C1C1;
    width: 15.9vw;
    margin-top: 1.6vh;
`;
const PencilImg = styled.img`
    position: absolute;
    height: 13px;
    width: 13px;
    bottom: 2vh;
    right: 5vw;
`;
const ImageContainer = styled.div`
    position: relative;
`;
const PlotHistory = styled.div`
    display: flex;
    margin-top: 4.74vh;
`;
const TableContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0px;
    width: 100%;
`;
const TableCell = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px;
    height: 7.6vh;
    background-color: ${(props) => (props.isOdd ? '#F1F3F6' : '#ffffff')};
`;
const TableHead = styled(TableCell)`
    background-color: #CCE2D2;
    position: relative;
`;
const StatusImg = styled.img`
    width: 2.5vh;
    height: 2.5vh;
`;
const DeleteBtn = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    right: 21%;
    top: 4%;
    background: #C1C1C1;
    border-radius: 100%;
    width: 5vh;
    height: 5vh;
`;

// UI แสดงข้อมูลแปลงผักขวาบน
const RightHistoryBar = () => {
    // เก็บค่า veg_name
    const [name, setName] = useState('ชื่อแปลงผัก');
    const handleNameChange = (e) => {
        setName(e.target.value);
      };

    // เก็บค่า type
    const [typeList , setTypeList] = useState(
        ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France']
    );
    const [selectType, setSelectType] = useState('');
    const handleTypeChange = (event) => {
        setSelectType(event.target.value);
    };

    // เก็บค่า sensor
    const [sensorList , setSensorList] = useState(
        ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France']
    );
    const [selectSensor, setSelectSensor] = useState('');
    const handleSensorChange = (event) => {
        setSelectSensor(event.target.value);
    };

    // เก็บค่า ประวัติ NPK
  const [rows, setRows] = useState([
    ['03/10/24', '20', '20', '20', 'N , K ไม่เหมาะสม', <StatusImg src={BadValue}></StatusImg>],
    ['03/10/24', '20', '20', '20', 'N , K ไม่เหมาะสม', <StatusImg src={goodValue}></StatusImg>],
  ]);
    
    
    return(
        <>
            <RightContainer>
                <PlotInformation>
                    <ImageContainer>
                        <PlotImage src={BadValue}></PlotImage>
                        <PencilImg src={pencil}></PencilImg>
                    </ImageContainer>
                    <PlotDetail>
                        <PlotTitle
                            type='text'
                            value={name}                        
                            onChange={handleNameChange}
                        />
                        <PlotInfo>
                            <InfoCard>
                                <Plottype>ประเภท</Plottype>
                                <PlotSelect value={selectType} onChange={handleTypeChange}>
                                    {typeList.map((type, index) => (
                                    <option key={index} value={type}>
                                        {type}
                                    </option>
                                    ))}
                                </PlotSelect>  
                            </InfoCard>
                            <InfoCard>
                                <Plottype>อุปกรณ์</Plottype>
                                <PlotSelect value={selectSensor} onChange={handleSensorChange}>
                                    {sensorList.map((sensor, index) => (
                                    <option key={index} value={sensor}>
                                        {sensor}
                                    </option>
                                    ))}
                                </PlotSelect>  
                            </InfoCard>
                        </PlotInfo>
                    </PlotDetail>

                    <DeleteBtn>ลบ</DeleteBtn>
                </PlotInformation>



                <PlotHistory>
                <TableContainer>
                    <TableHead >Date</TableHead>
                    <TableHead >N</TableHead>
                    <TableHead >P</TableHead>
                    <TableHead >K</TableHead>
                    <TableHead >ความเหมาะสม</TableHead>
                    <TableHead ></TableHead>
                    {rows.map((row, rowIndex) => (
                        <React.Fragment key={rowIndex}>
                        {row.map((cellData, colIndex) => (
                            <TableCell key={colIndex} isOdd={rowIndex % 2 !== 0}>{cellData}</TableCell>
                        ))}
                        </React.Fragment>
                    ))}
                </TableContainer>
                </PlotHistory>
            </RightContainer>
        </>
    )
}

const Container = styled.div`
    display: flex;
`;
const StyledH1 = styled(Link)`
    font-weight: bold;
    margin: 0 auto;
    letter-spacing: 2px;
    margin-top: 10vh;
    text-decoration: underline;
    color: #000;
    font-size: 64px;
    display: block;
    width: max-content;
`;
const  History = () => {
    const { user } = useAuth()
    return(
        <>
           <HeaderMenu isLogin={ user != null}/>
           {user != null 
           ?<Container>
                <LeftHistoryBar />
                <RightHistoryBar />
            </Container> 
            : <StyledH1 to="/login">LOG IN เพื่อตรวจสอบประวัติการใช้งาน</StyledH1>}

            {/* <Container>
                <LeftHistoryBar />
                <RightHistoryBar />
            </Container> */}
        </>
    )
}

export default History;