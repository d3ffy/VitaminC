import React, { useState , useEffect} from 'react';
import styled from 'styled-components';
import HeaderMenu from "./HeaderMenu";
import BadValue from "../image/badValue.png";
import goodValue from "../image/goodValue.png";
import pencil from "../image/pencil.png";
import CheckNpkContainer from './CheckNpkContainer.jsx';
import { GetSensorNames ,getPlantData ,GetPlotData ,addUserPlot ,GetPlotInfo, deletePlot, GetHistoryInfo} from "./FirestoreDB.jsx";

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
    background-color: ${(props) => (props.isViewing ? "#c5c5c5" : "#ffffff")};
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
    const [viewingPlot, setViewingPlot] = useState('');
    const [viewingPlotName, setViewingPlotName] = useState('');
    const [viewingPlotSensor, setViewingPlottSensor] = useState('');
    const [viewingPlotVeg, setViewingPlotVeg] = useState('');
    const handleClick = (id, name, sensor, veg) => {
        setViewingPlot(id);
        setViewingPlotName(name);
        setViewingPlottSensor(sensor);
        setViewingPlotVeg(veg);
      };

    // State สำหรับ list plot
    const { user } = useAuth()

    const [nameList , setNameList] = useState([]);
    const refreshPlotList = async () => {
        if (user) {
          const plots = await GetPlotInfo(user.email);
          const plotnames = plots.map((plot) => ({
            id: plot.id,
            name: plot.garden_name,
            sensor: plot.sensor,
            veg_name: plot.veg_name,
          }));
          setNameList(plotnames);
        }
      };
    useEffect(() => {
        refreshPlotList();
    }, [user]);

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
                    <PlotSection
                        key={plot.id}
                        onClick={() => handleClick(plot.id, plot.name, plot.sensor, plot.veg_name)}
                        isViewing={plot.id === viewingPlot}
                    >
                        {plot.name}
                    </PlotSection>
                ))}
            </SearchBoxContainer>

            <RightHistoryBar viewingPlot={viewingPlot} refreshPlotList={refreshPlotList} viewingPlotName={viewingPlotName}
                viewingPlotSensor={viewingPlotSensor} viewingPlotVeg={viewingPlotVeg}
            />
            {false ? <CheckNpkContainer viewingPlotName={viewingPlotName}/>: " "}
            {showAddPlotBox ? <><AddPlotBG onClick={showPlotBox}></AddPlotBG>
                                <AddPlotBox refreshPlotList={refreshPlotList} showPlotBox={showPlotBox}/>
                                </>: ""}
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

// POPUP เพิ่มแปลงผัก
const AddPlotBox = ({ refreshPlotList , showPlotBox }) => {
    const [sensorList , setSensorList] = useState(
        []
    );
    useEffect(() => {
        GetSensorNames().then((names) => setSensorList(names));
      }, []);
    const [selectSensor, setSelectSensor] = useState('');
    const handleSensorChange = (event) => {
        setSelectSensor(event.target.value);
    };

    const [plotName, setPlotName] = useState('');
    const handlePlotNameChange = (event) => {
        setPlotName(event.target.value);
    };

    // addUserPlot
    const { user } = useAuth();
    const addPlot = () => {
        // (user.email, plotName, "./path/Image", selectSensor, "")
        addUserPlot(user.email, plotName, "./path/Image", selectSensor, "ผักกาด");
        refreshPlotList();
        showPlotBox();
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
                            onChange={handlePlotNameChange}
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
                <LoginBtn onClick={addPlot} type="button">ยืนยัน</LoginBtn>
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
    background-color: ${(props) => (props.$isodd === `true` ? '#F1F3F6' : '#ffffff')};
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
const RightHistoryBar = ({ viewingPlot, refreshPlotList, viewingPlotName, viewingPlotSensor, viewingPlotVeg}) => {
    // เก็บค่า veg_name
    const [name, setName] = useState('ชื่อแปลงผัก');
    useEffect(() => {
        setName(viewingPlotName);
      }, [viewingPlotName]);
      
    const handleNameChange = (e) => {
        setName(e.target.value);
      };

    // เก็บค่า type
    const [typeName , setTypeName] = useState();
    useEffect(() => {
        setTypeName(viewingPlotVeg);
      }, [viewingPlotVeg]);
    const handleTypeChange = (event) => {
        setTypeName(event.target.value);
    };

    const [typeList , setTypeList] = useState([]);
    useEffect(() => {
        const getPlantNames = async () => {
          const plants = await getPlantData();
          const plotnames = plants.map((plant) => plant.name);
          setTypeList(plotnames);
        };
        getPlantNames();
    }, []);

    // เก็บค่า sensor
    const [sensorName , setSensorName] = useState();
    useEffect(() => {
        setSensorName(viewingPlotSensor);
      }, [viewingPlotSensor]);

    const [sensorList , setSensorList] = useState(
        []
    );
    useEffect(() => {
        GetSensorNames().then((names) => setSensorList(names));
      }, []);
    const handleSensorChange = (event) => {
        setSensorName(event.target.value);
    };

    const { user } = useAuth();
    const [rows, setRows] = useState([
        ['03/10/24', '20', '20', '20', 'N , K ไม่เหมาะสม', <StatusImg src={BadValue}></StatusImg>],
        ['03/10/24', '20', '20', '20', 'N , K ไม่เหมาะสม', <StatusImg src={goodValue}></StatusImg>],
    ]);
    useEffect(() => {
        const fetchHistoryData = async () => {
            if (user && user.email) {
                const data = await GetHistoryInfo(user.email, viewingPlot);
                const formattedRows = data.map((item) => [
                    item.date,
                    item.nitrogen,
                    item.phosphorus,
                    item.potassium,
                    'N , K ไม่เหมาะสม', 
                    <StatusImg src={BadValue}></StatusImg>,
                ]);
            setRows(formattedRows);
            }
        };
        fetchHistoryData();
    }, [user.email, viewingPlot]);

  const deleteUserPlot = () => {
    deletePlot(user.email, viewingPlot);
    refreshPlotList();
  };
    
    
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
                                <PlotSelect value={typeName} onChange={handleTypeChange}>
                                    {typeList.map((type, index) => (
                                    <option key={index} value={type}>
                                        {type}
                                    </option>
                                    ))}
                                </PlotSelect>  
                            </InfoCard>
                            <InfoCard>
                                <Plottype>อุปกรณ์</Plottype>
                                <PlotSelect value={sensorName} onChange={handleSensorChange}>
                                    {sensorList.map((sensor, index) => (
                                    <option key={index} value={sensor}>
                                        {sensor}
                                    </option>
                                    ))}
                                </PlotSelect>  
                            </InfoCard>
                        </PlotInfo>
                    </PlotDetail>

                    <DeleteBtn onClick={deleteUserPlot}>ลบ</DeleteBtn>
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
                            <TableCell key={colIndex} $isodd={rowIndex % 2 !== 0 ? `true` : `false`}>{cellData}</TableCell>
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
                {/* <RightHistoryBar /> */}
            </Container> 
            : <StyledH1 to="/login">LOG IN เพื่อตรวจสอบประวัติการใช้งาน</StyledH1>}
        </>
    )
}

export default History;