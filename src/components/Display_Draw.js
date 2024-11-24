import React, { useState } from 'react';
import { Row, Col, Button, Spin } from 'antd';

const Display_Draw = ({name , prize}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState('');

  const prizes = ['รางวัลใหญ่', 'รางวัลพิเศษ', 'รางวัลปลอบใจ']; // ตัวอย่างรางวัล

  const handleDraw = () => {
    setIsDrawing(true);
    setResult(''); // ล้างผลลัพธ์เดิม

    // เริ่มหมุน 5 วิ แล้วสุ่มผลลัพธ์
    setTimeout(() => {
      const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
      setResult(randomPrize);
      setIsDrawing(false);
    }, 5000); // หมุน 5 วินาที
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
          {isDrawing ? (
            <Spin size="large" tip="กำลังหมุน..." />
          ) : result ? (
            <>
                <h2
                    style={{
                      fontSize: '5vw',
                      fontWeight: 'bold',
                      marginBottom: '10px',
                    }}
                  >
                    {name}
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
                    ✨ ชื่อรางวัลที่ได้รับ ✨
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
                onClick={handleDraw}
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

export default Display_Draw;
