import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
const Display_Gift = ({name , prize}) => {
    
 
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
                    ✨{prize}✨
                  </h1>
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
}

export default Display_Gift

