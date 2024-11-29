import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [statusSubmit, setStatus] = useState(true);
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies(['luckyDrawData']);
  const [api_register,setAPI] = useState('')

  useEffect(()=>{
    const env_url =  process.env.REACT_APP_API;
    const apiEndpoint =  env_url+'/api/v1/register'
    setAPI(apiEndpoint)
  },[])
  // Redirect if cookie data exists
  useEffect(() => {
    if (cookies.luckyDrawData) {
      navigate('/luckydraw', { state: { jsonData: cookies.luckyDrawData } });
    }
  }, [cookies, navigate]);

  const handleFinish = (values) => {
    const { employeeID } = values;
    setStatus(true);
    form.resetFields();
    handleRegister(employeeID);
  };

  const handleRegister = async (employeeID) => {
    setLoading(true);
    const requestData = {
      employeeID: employeeID,
      email: '',
    };
    try {
      const response = await fetch(api_register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        setResponseMessage(data.message || 'Registration successful');
        console.log(data)
        // Save data to cookies
        setCookie('luckyDrawData', data, { path: '/', maxAge: 3600 }); // Cookie expires in 1 hour

        // Navigate to LuckyDraw page
        navigate('/luckydraw', { state: { jsonData: data } });
      } else {
        const errorData = await response.json();
        setStatus(false);
        setResponseMessage(errorData.error || 'Registration failed');
      }
    } catch (error) {
      setResponseMessage('An error occurred during registration.');
    } finally {
      setLoading(false);
      console.log(responseMessage)
    }
  };

  return (
    <>
    <div style={style.container}>
      <Row style={style.headers}>
          <h2 style={style.title}>MITRPHOL NEW YEAR</h2>
          <h2 style={style.title}>2025</h2>
      </Row>


      <Row
        style={{
          minHeight: '50vh',
          padding : '10px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          
          marginTop: '0', // ลดระยะห่างด้านบน
        }}
      >
        <Col xs={24} sm={16} md={12} lg={8}>
          <Card
            title={<h1 style={{ fontSize: 'calc(0.7em + 1.3vw)', textAlign: 'center', margin: 0 ,}}>Welcome to Mitrphol New Year</h1>}
            bordered={true}
            style={{
              border: '2px solid white',
              borderRadius: '16px',
              height: '50vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '8px',
            
            }}
          >
            <Form
              form={form}
              name="registerForm"
              onFinish={handleFinish}
              layout="vertical"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Form.Item
                label={<span style={{ fontSize: 'calc(1em + 0.5vw)' }}>Employee ID </span>}
                name="employeeID"
                rules={[{ required: true, message: 'Please enter your Employee ID!'}]}
              >
                <Input placeholder="Enter your Employee ID" style={{ fontSize: 'calc(1em + 0.3vw)' }} />
              </Form.Item>

              {!statusSubmit ? (
                <div style={{ color: 'red' }}>
                  Invalid Employee ID
                </div>
              ) : null}

              <Form.Item style={{ marginTop: '10px' }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  loading={loading}
                  style={{ fontSize: 'calc(1em + 0.3vw)' }}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
    
  
    </>
  );
};
const style = {
  container : {
    background : 'linear-gradient(to bottom, #44abab, #bce8e8)',
    height: '100vh'
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
  content_title : {
    position: "absolute",
    width: "266px",
    height: "72px",
    left: "27px",
    top: "90px",
    fontFamily: "'PT Serif'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "24px",
    lineHeight: "150%", // or use "36px" if you prefer that unit
    textAlign: "center",
    color: "#FFFFFF",
    textShadow: "0px 4px 4px rgba(0, 0, 0, 0.35)",
    
  }
};
export default RegisterPage;