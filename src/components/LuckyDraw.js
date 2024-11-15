import React from 'react';
import { useState,useEffect } from 'react';
import { useLocation } from 'react-router-dom';
const LuckyDrawPage = (props_json) => {
  const location = useLocation();
  const { jsonData } = location.state || {};  // ดึง jsonData ที่ส่งมาจาก RegisterPage
  
  const [loading, setLoading] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [isReceive , setIsReceive] = useState(false)
  const [ prize , setPrize] = useState()
  const webhook_url = "https://prod-45.southeastasia.logic.azure.com:443/workflows/22f1fe1a30cd463f8550b925827f0414/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=sDguADVRQzPRLZG8kgJTMfncTOkN1_kXg15qJ0_UwRE"

  useEffect(() => {
       
      if (jsonData) {
        setIsDraw(jsonData.isLuckydraw === 'true'); // Set isDraw based on jsonData immediately
        setPrize(jsonData.Gift)
        setIsReceive(jsonData.isReceive === 'true')
        // console.log(typeof(isReceive) + " : " +jsonData.isReceive)
        // console.log(typeof(isDraw ) + " : " +jsonData.isLuckydraw)
    }
  }, [jsonData]);

  const handleLuckyDraw = async () =>{   
    const requestData = {
      employeeID: jsonData.id,
      email: ''
    };

    try {
      const response = await fetch(webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        const { status, Gift } = data;
        setIsDraw(true);
        setIsReceive(status === 'true');
        setPrize(Gift)
      
      } else {
        console.error("Error:", await response.text());
        setIsReceive(false);
        setPrize('รอลุ้นในงาน');
      }
    } catch (error) {
      console.error("Request failed:", error);
      setPrize('รอลุ้นในงาน');
    } finally {
      setLoading(false);
    }
     console.log('isDraw:'+isDraw+": isReceive : "+isReceive)

  }

  return (
    <>
    {/* <div style={styles.container}>
      <div style={styles.header}>Lucky Draw</div> */}
      {isDraw ? (
        isReceive ? (
          <div style={styles.body}>
            <h2>Congratulations!</h2>
            <p>Your Prize: <strong>{prize}</strong></p>
          </div>
        ) : (
          <div style={styles.body}>
            <h2>รอลุ้นในงาน</h2>
          </div>
        )
      ) : (
        <div style={styles.container} >
        <div style={styles.header}>Lucky Draw</div>
          <div style={styles.body}>
                
          </div>
          <div style={styles.footer}>
            <button style={styles.button} onClick={handleLuckyDraw}>
              {loading ? 'Drawing...' : 'Draw'}
            </button>
          </div>
        </div>
      )}
    {/* </div> */}
    </>
  );
};
export default LuckyDrawPage;
// Inline styles for quick setup
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100vh',
    background: 'linear-gradient(to bottom, #FF6A00, #FFCB00)',   /* ฟ้าอ่อนถึงฟ้าเข้ม */
    padding: '5vw',
    textAlign: 'center',
  },
  header: {
    fontSize: '10vw',  // ขนาดตัวอักษรในส่วน header
    fontWeight :'bold',
    padding: '2vh 0', // ช่องว่างด้านบนและล่าง
  },
  body: {
    flexGrow: 1,  // ทำให้ body ขยายพื้นที่ที่เหลือ
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px',  // เพิ่มเส้นขอบ
    borderRadius: '10px',  // เพิ่มความโค้งให้ขอบ
    padding: '20px',  // เพิ่มช่องว่างภายใน body
    boxShadow: '0 8px 10px rgba(0, 0, 0, 0.1)',  // เพิ่มเงาให้ดูมีมิติ
    backgroundImage :'url(https://th.lovepik.com/image-649899113/floral-label-text-box-decoration.html)',
    margin : '20px',
    fontSize: '5vw', 
  },
  prizeBox: {
    position: 'relative',
    textAlign: 'center',
    padding: '2vw',
    border: '0.5vw solid #FF8C00',
    borderRadius: '2vw',
    backgroundColor: '#FFF7E6',
    boxShadow: '0 2vw 4vw rgba(0, 0, 0, 0.2)',
    width: '80vw',
    maxWidth: '400px',
    animation: 'fadeIn 1s',
    marginTop: '5vh',
  },
  waitBox: {
    padding: '4vw',
    backgroundColor: '#FFE4B2',
    borderRadius: '2vw',
    boxShadow: '0 2vw 4vw rgba(0, 0, 0, 0.2)',
    width: '80vw',
    maxWidth: '400px',
    marginTop: '10vh',
  },
  button: {
    padding: '4vw 8vw',
    fontSize: '5vw',
    color: '#FFF',
    backgroundColor: '#FF4500',
    border: 'none',
    borderRadius: '2vw',
    cursor: 'pointer',
    width: '80vw',
    maxWidth: '500px',
    transition: 'transform 0.3s ease',
    display: 'block',
    margin: '20px auto',
  },
  footer: {
    padding: '2vh 0',
    fontSize: '3vw',
    color: '#FFFFFF',
  },
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
};
