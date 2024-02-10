import React, { useState } from 'react';
import styled from 'styled-components';
import HeaderMenu from "./HeaderMenu";
import BadValue from "../image/badValue.png";
import goodValue from "../image/goodValue.png";
import pencil from "../image/pencil.png";

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
    padding: 2vh 4vw;
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

    return(
        <>
            <SearchBoxContainer>
                <SearchBox
                        type="text"
                        placeholder="ค้นหาแปลงผัก..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                <AddPlotBtn>add new plot</AddPlotBtn>

                {filteredList.map((plot, index ) => ( 
                    plot.id === viewingPlot ? (
                    <PlotSectionViewing onClick={() => handleClick(plot.id)} key={index}>{plot.name}</PlotSectionViewing>
                ) : (
                    <PlotSection onClick={() => handleClick(plot.id)} key={index}>{plot.name}</PlotSection>)
                ))}
            </SearchBoxContainer>
        </>
    )
}



const RightContainer = styled.div`
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
const  History = () => {
    return(
        <>
           <HeaderMenu />
            <Container>
                <LeftHistoryBar />
                <RightHistoryBar />
            </Container>
        </>
    )
}

export default History;