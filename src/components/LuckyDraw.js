import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Row, Col, Button, Spin } from 'antd';

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
  const api_draw = 'http://localhost:3000/api/v1/draw';

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
      // Test Case Manager or After CutOffTime
      // setHasLuckyDraw(false)
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
        // ใช้ optional chaining เพื่อหลีกเลี่ยงการ error
        const gift = data.gift || {};
        const isreceive = data.isreceive || false;
        console.log(gift)

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
          <h2 style={styles.text}>{jsonData.name}</h2>
          <h1 style={styles.success}>✨ ลงทะเบียนสำเร็จ ✨</h1>
        </>
      );
    }else{
      if (isDraw) {
        return (
          <>
            <h2 style={styles.text}>{jsonData.name}</h2>
            <h2 style={styles.text}>คุณได้รับ</h2>
            <h1 style={styles.prize}>{prize}</h1>
            <h1 style={styles.prize}>✨ ✨ ✨ ✨ ✨</h1>
          </>
        );
      }else {
  
        return (
          <>
            <h2 style={styles.text}>{prize}</h2>
            <Button style={styles.button} onClick={handleDraw}>
              กดปุ่มเพื่อสุ่ม!
            </Button>
          </>
        );
      }
    }

   
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <Row style={styles.headerContainer}>
        <Col span={24}>
          <h1 style={styles.header}>🎉 Mitrphol New Year 2025 🎉</h1>
        </Col>
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
    background: 'linear-gradient(to bottom, #f7d794, #f6b93b)',
    fontFamily: "'Poppins', sans-serif",
    color: '#333',
  },
  headerContainer: {
    height: '15vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to bottom ,#f6b93b ,#f7d794)',
  },
  header: {
    fontSize: '6vw',
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
    fontSize: '5vw',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  prize: {
    fontSize: '6.2vw',
    fontWeight: 'bold',
    margin: '20px 0',
    color: '#f6b93b',
    textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
  },
  success: {
    fontSize: '8vw',
    fontWeight: 'bold',
    margin: '20px 0',
    color: '#f6b93b',
    textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
  },
  button: {
    backgroundColor: '#f6b93b',
    borderColor: '#e58e26',
    fontSize: '5vw',
    height: 'auto',
    padding: '10px 20px',
    color: '#fff',
    fontWeight: 'bold',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease',
  },
  footerContainer: {
    height: '15vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to bottom, #f6b93b, #e58e26)',
  },
  footer: {
    fontSize: '6vw',
    fontWeight: 'bold',
    textAlign: 'center',
  },
};

export default LuckyDrawPage;
