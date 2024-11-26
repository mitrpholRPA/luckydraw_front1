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
  const [api_register , setApi] = useState('')
  
  // const apiEndpoint = window.RUNTIME_CONFIG?.REACT_APP_API || process.env.REACT_APP_API;

  useEffect(()=>{
      const apiEndpoint =  process.env.REACT_APP_API_URL+'/api/v1/register'
      console.log(apiEndpoint)
      setApi(apiEndpoint)
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
    console.log(api_register)
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
    <Row
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #00c6fb, #005bea)',
        padding: '3px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Col xs={24} sm={16} md={12} lg={8}>
        <Card
          title={<h1 style={{ fontSize: 'calc(0.7em + 1vw)', textAlign: 'center', margin: 0 }}>Register</h1>}
          bordered={true}
          style={{
            border: '2px solid #1890ff',
            borderRadius: '16px',
            height: '70vh',
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
  );
};

export default RegisterPage;
