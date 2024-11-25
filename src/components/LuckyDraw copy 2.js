import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Row , Col, Button, Spin } from 'antd';

const LuckyDrawPage = () => {
  const location = useLocation();
  const { jsonData: locationJsonData } = location.state || {}; // Data from navigation
  const [cookies, setCookie] = useCookies(['luckyDrawData']); // Access cookies

  // State variables
  const [ jsonData, setJsonData] = useState(locationJsonData || cookies.luckyDrawData || {});
  const [ isDraw, setIsDraw] = useState(false);
  const [ isReceive, setIsReceive] = useState(false);
  const [ prize, setPrize] = useState('');
  const prizes = ['รางวัลใหญ่', 'รางวัลพิเศษ', 'รางวัลปลอบใจ']; // ตัวอย่างรางวัล

  const api_draw = 'http://localhost:3000/api/v1/draw';

  useEffect(() => {
      // Initialize state with data from cookies if available
      if (cookies.luckyDrawData) {
        setJsonData(cookies.luckyDrawData);
      }
  
      // Set states based on the current jsonData
      if (jsonData) {
        setIsDraw(jsonData.isluckydraw === 'true');
        setPrize(jsonData.gift_name || '');
        setIsReceive(jsonData.isreceive === 'true')
      }
    }, [cookies, jsonData]);

    const handleLuckyDraw = async () => {
      const requestData = {
        employeeID: jsonData.id,
        email: '',
      };
    
      try {
        const response = await fetch(api_draw, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });
    
        if (response.ok) {
          const data = await response.json();
          const { status, Gift } = data;
          const updatedData = {
            ...jsonData,
            isluckydraw: 'true',
            isreceive: status === 'true' ? 'true' : 'false',
            gift_name: Gift,
            expiry: new Date(Date.now() + 3600 * 1000).toISOString(), // ตั้งวันหมดอายุใหม่ (1 ชั่วโมง)
          };
    
          // อัปเดต Cookie และ State
          setJsonData(updatedData);
          setCookie('luckyDrawData', updatedData, { path: '/', maxAge: 3600 }); // เก็บ Cookie ใหม่
    
          // เริ่มหมุน
          setIsDraw(true);
    
          // ป้องกันไม่ให้กดปุ่มซ้ำ
          setTimeout(() => {
            // สุ่มรางวัล
            const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
            setIsDraw(false); // หยุดหมุน
            setPrize(randomPrize); // แสดงรางวัลที่สุ่มได้
            setIsReceive(status === 'true'); // แสดงว่าได้รับรางวัลหรือไม่
          }, 3000); // หมุน 3 วินาที
        } else {
          console.error('Error:', await response.text());
          setPrize('รอลุ้นในงาน');
        }
      } catch (error) {
        console.error('Request failed:', error);
        setPrize('รอลุ้นในงาน');
      }
    };
    
    


  return (
    <div
    style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #f7d794, #f6b93b)',
        fontFamily: "'Poppins', sans-serif",
        color: '#333', // เปลี่ยนเป็นโทนสีเข้มอ่อน
      }}
    >
        {/* Header */}
        <Row
        style={{
            height: '15vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom ,#f6b93b ,#f7d794  )',

        }}
        >
        <Col span={24}>
            <h1
            style={{
                fontSize: '6vw', // ใช้ vw เพื่อปรับตามความกว้างหน้าจอ
                fontWeight: 'bold',
                textAlign: 'center',
            }}
            >
            🎉 Mitrphol New Year 2025 🎉
            </h1>
        </Col>
        </Row>

      {/* Content */}
      <Row
        style={{
            height: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding :'10px'
            }}
      >
        <Col span={24}>
          {isDraw ? (
            <Spin size="large" tip="กำลังหมุน..." />
          ) : isReceive ? (
            <>
                <h2
                    style={{
                      fontSize: '5vw',
                      fontWeight: 'bold',
                      marginBottom: '10px',
                    }}
                  >
                    {jsonData}
                  </h2>
                  <h2
                    style={{
                      fontSize: '4vw',
                      fontWeight: 'bold',
                      marginBottom: '10px',
                    }}
                  >
                    คุณได้รับ
                  </h2>
                  <h1
                    style={{
                      fontSize: '8vw',
                      fontWeight: 'bold',
                      margin: '20px 0',
                      color: '#f6b93b',
                      textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                    }}
                  >
                    ✨ {prize} ✨
                  </h1>
            </>
          ) : (
                <Button
                type="primary"
                size="large"
                style={{
                    backgroundColor: '#f6b93b', // สีทองอ่อน
                    borderColor: '#e58e26', // สีทองเข้ม
                    fontSize: '5vw',
                    height: 'auto',
                    padding: '10px 20px',
                    color: '#fff', // ตัวอักษรสีขาว
                    fontWeight: 'bold',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)', // เงาเพิ่มมิติ
                    borderRadius: '8px', // มุมปุ่มโค้งมน
                    transition: 'background-color 0.3s ease', // เพิ่มเอฟเฟกต์เปลี่ยนสี
                }}
                onClick={handleLuckyDraw}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e58e26')} // เปลี่ยนสีเมื่อ Hover
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f6b93b')} // คืนสีเดิมเมื่อออกจาก Hover
                >
                กดปุ่มเพื่อสุ่ม!
                </Button>

          )}
        </Col>
      </Row>
    {/* Footer */}
    <Row
        style={{
            height: '15vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom, #f6b93b, #e58e26)',
        }}
        >
        <Col span={24}>
            <h1
            style={{
                fontSize: '6vw', // ใช้ vw เพื่อปรับตามความกว้างหน้าจอ
                fontWeight: 'bold',
                textAlign: 'center',
            }}
            >
            🎉 ขอบคุณที่ร่วมกิจกรรม 🎉
            </h1>
        </Col>
      </Row>
    </div>
  );
};

export default LuckyDrawPage;