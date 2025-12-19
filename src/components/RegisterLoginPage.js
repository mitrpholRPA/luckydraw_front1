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
    const { emailAddress } = values;
    setStatus(true);
    form.resetFields();
    handleRegister(emailAddress);
  };

  const handleRegister = async (emailAddress) => {
    setLoading(true);
    const requestData = {
      'email': emailAddress
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
          <h2 style={style.title}>2026</h2>
      </Row>

      <Row style={style.content}>
        <Col xs={24} sm={16} md={12} lg={8}>
          <Card
            title={<h1 style={style.text_content}>Welcome to Mitrphol New Year</h1>}
            bordered={true}
            style={style.contentForm}
          >
            <Form
              form={form}
              name="registerForm"
              onFinish={handleFinish}
              layout="vertical"
              style={style.form}
            >
              <Form.Item
                label={<span style={style.formLabel}>Email </span>}
                name="emailAddress"
                rules={[{ required: true, message: 'Please enter your Email!'}]}
              >
                <Input placeholder="Enter your Email " style={style.formPlaceholder} />
              </Form.Item>

              {!statusSubmit ? (
                <div style={style.alertLabel}>
                  Invalid Email
                </div>
              ) : null}

              <Form.Item style={style.formItemButton}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  loading={loading}
                  style={style.formButton}
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
  content : {
      minHeight: '50vh',
      padding : '10px 10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
  },
  text_content :{ 
    // fontSize: 'calc(0.7em + 1.3vw)', 
    fontSize: 'clamp(14px, 16px, 20px)',
    textAlign: 'center',
    margin: 0 ,
    color : '#346B9D',
    fontFamily :'Inter'
  },
  contentForm :{
    border: '2px solid white',
    borderRadius: '16px',
    height: '50vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '8px',
  },
  form :{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
  },
  formLabel :{ 
    fontSize: 'clamp(14px, 16px, 20px)',
    color :'#346B9D'
  },
  formPlaceholder : { 
    fontSize: 'calc(1em + 0.3vw)' 
  },
  alertLabel :{
     color: 'red'
  },
  formItemButton :{
     marginTop: '10px',
     display: 'flex',              // Add this
     justifyContent: 'center',     // Add this
     alignItems: 'center',         // Add this
  },
  formButton : { 
    fontSize: 'calc(1em + 0.3vw)',
    backgroundColor  : '#346B9D',
    color :'white',
    width: '238px',
    height: '33px',
    borderRadius: '12px'
    
    
  },

};
export default RegisterPage;