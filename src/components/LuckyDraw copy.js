import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Row, Col, Button, Spin } from 'antd';
import './LuckyDraw.css'

const LuckyDrawPage = () => {
  const location = useLocation();
  const { jsonData: locationJsonData } = location.state || {};
  const [cookies, setCookie] = useCookies(['luckyDrawData']);
  // State variables
  const [jsonData, setJsonData] = useState(locationJsonData || cookies.luckyDrawData || {});
  const [hasLuckyDraw, setHasLuckyDraw] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [isSpin, setSpinner] = useState(false);
  const [prize, setPrize] = useState('');
  const [api_draw,setAPI] = useState('')
  
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
      console.log(jsonData.isluckydraw)
      setPrize(jsonData.gift_details|| '');
      setHasLuckyDraw(jsonData.has_lucky_draw);
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
        console.log("update Cookies")
        console.log(updatedData)
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
    }
  };

  const renderPrizeSection = () => {
    if (isSpin) {
      return <Spin size="large" tip="กำลังหมุน..." />;
    }

    if (!hasLuckyDraw) {
      return (
        <>
          <h2 style={styles.textName}>{jsonData.name}</h2>
          <h1 style={styles.success}>✨ ลงทะเบียนสำเร็จ ✨</h1>
        </>
      );
    }else{
      if (isDraw) {
        return (
          <>
            <h1 style={styles.success}>✨ ลงทะเบียนสำเร็จ ✨</h1>
            <h2 style={styles.textName}>{jsonData.name}</h2>
            { prize === 'รอลุ้นในงาน' || prize ===''? (
              <>
                <h2 style={styles.text}> คุณไม่ได้รับรางวัล </h2>
                <h1 style={styles.prize}>รอลุ้นในงาน</h1>
              </>
              ):(
              <h2 style={styles.text}>คุณได้รับ</h2>
              )
            }
            <h1 style={styles.prize}>{prize}</h1>

            <h1 style={styles.star}>✨ ✨ ✨ ✨ ✨ </h1>
          </>
        );
      }else {
        return (
          <>
            <Button style={styles.button} onClick={handleDraw}>
              LuckyDraw 
            </Button>
          </>
        );
      }
    }
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
          <h1 style={styles.footer}>🎉 ขอบคุณที่ร่วมกิจกรรม 🎉</h1>
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
    background : `linear-gradient(to bottom, #44abab, white) , url('./flower.png')`,
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
    paddingBottom : '20px',
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
  },
  headerContainer: {
    height: '15vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 'clamp(20px, 6vw, 70px)', // Responsive font size
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    height: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '10px',
  },
  text: {
    fontSize:'clamp(17px, 4vw, 45px)',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  textName: {
    fontSize:'clamp(20px, 4vw, 45px)',
    fontWeight: 'bold',
    marginBottom: '10px',
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
  star: {
    fontSize:'clamp(20px, 6vw, 50px)',
    fontWeight: 'bold',
    margin: '20px 0',
    color: '#eaeded',
    textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
   
  },
  success: {
    fontSize:'clamp(20px, 8vw, 40px)',
    fontWeight: 'bold',
    margin: '20px 0',
    color: '#f6b93b',
    textShadow: '2px 2px 8px rgba(0,0,0,0.3)',

  },
  button: {
    backgroundColor: '#f1c40f',
    borderColor: '#e58e26',
    fontSize: '7vw',
    height: 'auto',
    padding: '10px 20px',
    color: '#fff',
    fontWeight: 'bold',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    borderRadius: '18px',
    transition: 'background-color 0.3s ease',
    minWidth: '200px',          // กำหนดความกว้างขั้นต่ำ
    maxWidth: '700px',          // กำหนดความกว้างสูงสุด
    minHeight: '90px',          // กำหนดความสูงขั้นต่ำ
    maxHeight: '200px',         // กำหนดความสูงสูงสุด
  },
  footerContainer: {
    height: '10vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // background: 'linear-gradient(to bottom, #f6b93b, #e58e26)',
  },
  footer: {
    fontSize:'clamp(20px, 6vw, 50px)',
    fontWeight: 'bold',
    textAlign: 'center',
  },
};

export default LuckyDrawPage;