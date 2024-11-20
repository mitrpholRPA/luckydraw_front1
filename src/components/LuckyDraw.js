import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const LuckyDrawPage = () => {
  const location = useLocation();
  const { jsonData: locationJsonData } = location.state || {}; // Data from navigation
  const [cookies, setCookie] = useCookies(['luckyDrawData']); // Access cookies

  // State variables
  const [jsonData, setJsonData] = useState(locationJsonData || cookies.luckyDrawData || {});
  const [loading, setLoading] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [isReceive, setIsReceive] = useState(false);
  const [prize, setPrize] = useState('');
  const webhook_url = "https://prod-45.southeastasia.logic.azure.com:443/workflows/22f1fe1a30cd463f8550b925827f0414/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=sDguADVRQzPRLZG8kgJTMfncTOkN1_kXg15qJ0_UwRE";

  useEffect(() => {
    // Initialize state with data from cookies if available
    if (cookies.luckyDrawData) {
      setJsonData(cookies.luckyDrawData);
    }

    // Set states based on the current jsonData
    if (jsonData) {
      setIsDraw(jsonData.isluckydraw === 'true');
      setPrize(jsonData.gift_name || '');
      setIsReceive(jsonData.isreceive === 'true');
      
    }
  }, [cookies, jsonData]);

  const handleLuckyDraw = async () => {
    setLoading(true);
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
        console.log(data)
        const { status, Gift } = data;
        const updatedData = {
          ...jsonData,
          isluckydraw: 'true',
          isreceive: status === 'true' ? 'true' : 'false',
          Gift,
        };

        // Update states and cookies
        setIsDraw(true);
        setIsReceive(status === 'true');
        setPrize(Gift);
        setJsonData(updatedData);
        setCookie('luckyDrawData', updatedData, { path: '/', maxAge: 3600 }); // Save to cookie for 1 hour
      } else {
        console.error('Error:', await response.text());
        setPrize('รอลุ้นในงาน');
      }
    } catch (error) {
      console.error('Request failed:', error);
      setPrize('รอลุ้นในงาน');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isDraw ? (
        isReceive ? (
          <div style={styles.container}>
            <div style={styles.header}>Lucky Draw</div>
            <div style={styles.body}>
              <h2>Congratulations!</h2>
              <p>Your Prize: <strong>{prize}</strong></p>
            </div>
          </div>
        ) : (
          <div style={styles.container}>
            <div style={styles.header}>Lucky Draw</div>
            <div style={styles.body}>
              <p>สุ่มแล้ว รอจับฉลากภายในงาน</p>
            </div>
          </div>
        )
      ) : (
        <div style={styles.container}>
          <div style={styles.header}>Lucky Draw</div>
          <div style={styles.body}></div>
          <div style={styles.footer}>
            <button style={styles.button} onClick={handleLuckyDraw} disabled={loading}>
              {loading ? 'Loading...' : 'Draw'}
            </button>
          </div>
        </div>
      )}
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
    background: 'linear-gradient(to bottom, #005bea,#00c6fb)',
    padding: '5vw',
    textAlign: 'center',
  },
  header: {
    fontSize: 'clamp(40px, 8vw, 80px)',
    fontWeight: 'bold',
    padding: '2vh 0',
  },
  body: {
    flexGrow: 1,
    display: 'flex',
    width: '65vw',
    maxWidth: '450px',
    height: '25vh',
    maxHeight: '400px',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '5px',
    borderRadius: '15px',
    padding: '10px',
    boxShadow: '0 8px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    margin: 'auto',
    fontSize: '3vw',
  },
  footer: {
    padding: '2vh 0',
    fontSize: '3vw',
    color: '#FFFFFF',
    marginTop: 'auto',
  },
  button: {
    padding: 'clamp(10px, 4vw, 20px) clamp(20px, 8vw, 40px)',
    fontSize: 'clamp(14px, 5vw, 24px)',
    color: '#FFF',
    backgroundColor: '#FF4500',
    border: 'none',
    borderRadius: 'clamp(5px, 2vw, 15px)',
    cursor: 'pointer',
    width: 'clamp(150px, 80vw, 500px)',
    transition: 'transform 0.3s ease',
    display: 'block',
    margin: '20px auto',
  },
};
