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
    <div style={{background : 'linear-gradient(to bottom, #44abab, #bce8e8)',height: '100vh'}}>
      <Row>
        <div style={style.content_title}>MITRPHOL NEW YEAR</div>
        <div style={style.content_title}>2025</div>
      </Row>

      <Row>
          
      </Row>

      <Row
      >
        <Col xs={24} sm={16} md={12} lg={8}>
          <Card
            title={<h1 style={{ fontSize: 'calc(0.7em + 1.3vw)', textAlign: 'center', margin: 0 ,}}>Welcome to Mitrphol New Year</h1>}
            bordered={true}
            style={
              style.rectangleStyle
            }
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

const styles = {
    mobile: {
      position: "relative",
      width: "100vh",
      height: "100vh",
      background: "linear-gradient(180deg, #3CDAD7 0%, #238B88 100%)",
    },
    watercolorTexture: {
      position: "absolute",
      width: "1301px",
      height: "800px",
      left: "-370px",
      top: "0px",
      background: "url('/path/to/watercolor-paper-texture.jpg')",
      mixBlendMode: "color-burn",
    },
    image: {
      position: "absolute",
      width: "319px",
      height: "423px",
      left: "1px",
      top: "377px",
      background: "url('/path/to/image [Background removed].png')",
      mixBlendMode: "color-burn",
      opacity: "0.5",
      borderRadius: "33px 33px 0px 0px",
    }}

const styletest = {
  content_title_newYear: {
    position: "absolute",
    width: "266px",
    height: "72px",
    left: "27px",
    top: "90px", // Position for "MITRPHOL NEW YEAR"
    fontFamily: "'PT Serif'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: 'clamp(20px, 5vw, 40px)',
    lineHeight: "150%",
    textAlign: "center",
    color: "#FFFFFF",
    textShadow: "0px 4px 4px rgba(0, 0, 0, 0.35)",
  },
  content_title_2025: {
    position: "absolute",
    width: "266px",
    height: "72px",
    left: "27px",
    top: "140px", // Position for "2025"
    fontFamily: "'PT Serif'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: 'clamp(20px, 5vw, 40px)',
    lineHeight: "150%",
    textAlign: "center",
    color: "#FFFFFF",
    textShadow: "0px 4px 4px rgba(0, 0, 0, 0.35)",
  },
  rectangleStyle: {
    position: "absolute",
    width: "266px",
    height: "287px",
    left: "27px",
    top: "189px",
    background: "#FFFFFF",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: "20px",
  },
};

const style = {

  container : {
    backgroundImage: "url(/images/bg_register.png)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100vh",
    marginTop: "20px", // Push the container from the top of the screen
    minHeight: "calc(100vh - 20px)", // Ensures the container stretches downward

  },
  content_title: {
    position: "absolute",
    width: "266px",
    height: "72px",
    left: "27px",
    top: "90px", // Position for "MITRPHOL NEW YEAR"
    fontFamily: "'PT Serif'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: 'clamp(20px, 5vw, 40px)',
    lineHeight: "150%",
    textAlign: "center",
    color: "#FFFFFF",
    textShadow: "0px 4px 4px rgba(0, 0, 0, 0.35)",
  },
  rectangleStyle : {
    position: "absolute",
    width: "266px",
    height: "287px",
    left: "27px",
    top: "189px",
    background: "#FFFFFF",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: "20px",
  }
};
export default RegisterPage;