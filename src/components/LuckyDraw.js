import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Row, Col, Button, Spin } from 'antd';

import './LuckyDraw.css'
import './GiftBox.css'
import GiftBox  from './GiftBox';
const LuckyDrawPage = () => {
  const location = useLocation();
  const { jsonData: locationJsonData } = location.state || {};
  const [cookies, setCookie] = useCookies(['luckyDrawData']);
  // State variables
  const [jsonData, setJsonData] = useState(locationJsonData || cookies.luckyDrawData || {});
  // const [hasLuckyDraw, setHasLuckyDraw] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [isSpin, setSpinner] = useState(false);
  const [prize, setPrize] = useState('');
  const [api_draw,setAPI] = useState('')
  // const [isReceiveGift,setReceiveGift] = useState(false)
  
  useEffect(()=>{
    const env_url =  process.env.REACT_APP_API;
    const apiEndpoint =  env_url+'/api/v1/draw';
    setAPI(apiEndpoint)
  },[])


  // Initialize state from cookies
  useEffect(() => {
    if (cookies.luckyDrawData) {
      setJsonData(cookies.luckyDrawData);
    }
    if (jsonData) {
      console.log(jsonData)
      setIsDraw(jsonData.isluckydraw);
      // setReceiveGift(jsonData.isreceive);
      setPrize(jsonData.gift_details|| '');
      // setHasLuckyDraw(jsonData.has_lucky_draw);
      //Test

    }
  }, [cookies , jsonData]);

  const handleDraw = async () => {
    setSpinner(true);
    setIsDraw(true);
    const requestData = { employeeID: jsonData.id };
    try {
      const response = await fetch(api_draw, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        // ใช้ optional chaining เพื่อหลีกเลี่ยงการ error
        const gift = data.gift || {};
        const isreceive = data.isreceive || false;
        const updatedData = {
          ...jsonData,
          isluckydraw: true,
          isreceive,
          gift_id: gift.gift_id || '',
          gift_details: gift.gift_details || 'รอลุ้นในงาน', // เพิ่ม default value
          giver: gift.giver || '',
        };
        
        setPrize(gift?.details || 'รอลุ้นในงาน');
        setJsonData(updatedData);
        setCookie('luckyDrawData', updatedData, { path: '/', maxAge: 3600 });
      } else {
        console.error('Error:', await response.text());
        setPrize('รอลุ้นในงาน');
      }
    } catch (error) {
      console.error('Request failed:', error);
      setPrize('รอลุ้นในงาน');
    } finally {
      setSpinner(false);
      console.log(prize)
    }
  };

  // const renderPrizeSection = () => {
  //   if (isSpin) {
  //     return <Spin size="large" tip="กำลังหมุน..." />;
  //   }

  //   if (!hasLuckyDraw) {
  //     return (
  //       <>
  //         <h2 style={styles.textName}>{jsonData.name}</h2>
  //         <h1 style={styles.success}>✨ ลงทะเบียนสำเร็จ ✨</h1>
  //       </>
  //     );
  //   }else{
  //     if (isDraw) {
  //       return (
  //         <>
  //           <h1 style={styles.textRegister}>ลงทะเบียนสำเร็จ</h1>
  //           <h2 style={styles.textName}>{jsonData.name}</h2>
  //           <GiftBox isDraw ={true} displayPrize = {prize} isRecive={isReceiveGift}/>
  //         </>
  //       );
  //     }else {
  //       return (
  //         <>
  //         {isReceiveGift ? (
  //           <GiftBox isDraw ={false} displayPrize ={''} isRecive={isReceiveGift}/>
  //         ):(
  //           <>
  //           <GiftBox isDraw ={false} isRecive={false}/>
 
  //           <div style={styles.buttonContainer}>
  //             <Button style={styles.button} onClick={handleDraw}>
  //               LuckyDraw
  //             </Button>
  //           </div>
  //           </>
  //           )
  //         }

  //         </>
  //     )
  //     }
  //   }
  // };
  const renderPrizeSection = () => {
    if (isSpin) {
      return <Spin size="large" tip="กำลังหมุน..." />;
    }

    const { name, has_lucky_draw, isreceive } = jsonData;
    if (!has_lucky_draw) {
      return (
        <>
          <h2 style={styles.textName}>{name}</h2>
          <h1 style={styles.success}>✨ ลงทะเบียนสำเร็จ ✨</h1>
        </>
      );
    }

    return (
      <>
        <h1 style={styles.textRegister}>ลงทะเบียนสำเร็จ</h1>
        <h2 style={styles.textName}>{name}</h2>
        <GiftBox isDraw={isDraw} displayPrize={prize} isRecive={isreceive} />
        {!isDraw && !isreceive && (
          <div style={styles.buttonContainer}>
            <Button style={styles.button} onClick={handleDraw}>LuckyDraw</Button>
          </div>
        )}
      </>
    );
  };
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <Row style={styles.headers}>
          <h2 style={styles.title}>MITRPHOL NEW YEAR</h2>
          <h2 style={styles.title}>2025</h2>
      </Row>

      {/* Content */}
      <Row style={styles.content}>
        <Col span={24}>{renderPrizeSection()}</Col>
      </Row>

      {/* Footer */}
      <Row style={styles.footerContainer}>
        <Col span={24}>
          <h1 style={styles.contentFooter}>ขอบคุณที่ร่วมกิจกรรม</h1>
        </Col>
      </Row>
    </div>
  );
};

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    // background: 'linear-gradient(to bottom, #f7d794, #f6b93b)',
    background : `linear-gradient(to bottom, #3CDAD7, #238B88) , url('./flower.png')`,
    fontFamily: "'Poppins', sans-serif",
    color: '#333',
  },
  headers :{
    minHeight: '10vh',
    Height: '20vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop : '50px',
    color :'white',
    fontSize :'clamp(17px, 4.5vw, 30px)',
    marginBottom: '0', // ลดระยะห่างด้านล่าง
  },
  title : {
    width: "100%",
    height: "10px",
    fontFamily: "'PT Serif'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: 'clamp(24x, 6vw, 40px)',
    textAlign: "center",
    color: "#FFFFFF",
    textShadow: "0px 4px 4px rgba(0, 0, 0, 0.35)",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop : '5px'
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    
  },
  textRegister : {
    fontFamily : 'Inter',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '150%',
    fontSize:'clamp(20px, 25px, 45px)',
    color: '#FFFFFF',
    textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    margin : 0
  },
  textName : {
    fontFamily : 'Inter',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '150%',
    fontSize:'clamp(20px, 25px, 45px)',
    color: '#FFFFFF',
    textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    margin : '10px'

  },
  contentFooter : {
    fontFamily : 'Inter',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: '150%',
    fontSize:'clamp(20px, 25px, 45px)',
    color: '#FFFFFF',
    textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    textAlign : 'center',
    margin : 0
  },
  prize: {
    fontSize:'clamp(20px, 6vw,  60px)',
    fontWeight: 'bold',
    margin: '20px 0',
    padding : '0px',
    color: '#212f3d',
    textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
    borderStyle : 'solid',
    borderRadius : '18px',
    borderColor : '#a3e4d7 ',
    backgroundColor :'#f9e79f'
  },

  footerContainer: {
    display: 'flex',             /* ใช้ flexbox */
    justifyContent: 'center',    /* จัดกลางในแนวนอน */
    alignItems: 'center',        /* จัดกลางในแนวตั้ง */
    height: 'auto',              /* ให้ footer มีความสูงตามเนื้อหาภายใน */
    padding: '10px 0',           /* เพิ่ม padding สำหรับช่องว่างด้านบนและล่าง */
    margin: 0,                   /* ลบ margin ที่ไม่ต้องการ */
  },
  buttonContainer: {
    display: 'flex',            /* ใช้ flexbox สำหรับจัดกลาง */
    justifyContent: 'center',   /* จัดปุ่มให้อยู่กลางในแนวนอน */
    alignItems: 'center',       /* จัดปุ่มให้อยู่กลางในแนวตั้ง */
    width: '100%',              /* ให้ container ครอบคลุมความกว้างทั้งหมด */
    height: '100%',             /* ให้ container ครอบคลุมความสูงทั้งหมด */
  },
  button: {
    backgroundColor: '#f1c40f',
    borderColor: '#e58e26',
    fontSize: '4vw',
    height: 'auto',
    padding: '10px 20px',
    color: '#fff',
    fontWeight: 'bold',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    borderRadius: '18px',
    transition: 'background-color 0.3s ease',
    minWidth: '200px',          // กำหนดความกว้างขั้นต่ำ
    maxWidth: '700px',          // กำหนดความกว้างสูงสุด
    minHeight: '70px',          // กำหนดความสูงขั้นต่ำ
    maxHeight: '150px',         // กำหนดความสูงสูงสุด
    margin : '20px',
    display: 'flexbox',
    justifyContent: 'center',  /* จัดให้อยู่กลางในแนวนอน */
    alignItems: 'center',    /* จัดให้อยู่กลางในแนวตั้ง */
  },
  

};

export default LuckyDrawPage;