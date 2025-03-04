import caserLogo from "../images/caser_logo.png"; // ✅ Import the CSS file
import React from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {Form, Input, Button, Card} from 'antd';
import './Login.css';
import { useAppMonoRJContext } from "../MonoRJAppContext"; // Import context hook


const Login = () => {
    const navigate = useNavigate();
    const [loginFailed, setLoginFailed] = React.useState('');

    const { login, logout } = useAppMonoRJContext();

    const onFinish = async (values: any) => {
        try {
            // Call login API
            const response = await axios.post('/mono/api/auth/login', {
                username: values.username,
                password: values.password,
            });

            // Extract tokens
            const accessToken = response.data.accessToken;
            const refreshToken = response.data.refreshToken;

            // Store tokens in localStorage
            localStorage.setItem('jwtToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            // Update authentication state
            login();

            // Redirect to the home page
            navigate('/');

        } catch (error) {
            // Ensure the user is marked as not authenticated
            logout();

            // Show login failure message
            setLoginFailed('Error al iniciar sesión, intenta de nuevo');
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        // console.log('Failed:', errorInfo);
        setLoginFailed('Error al iniciar sesión, intenta de nuevo');
    };

    const onInputChange = (e: any) => {
        setLoginFailed('');
    }

    return (
        <div className={'login-container'}>
            <div className={'login-logo'}>
                <img src={caserLogo} alt="Caser Logo"/>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'center', width: '100%', backgroundColor: '#68A5AC'
            }}>
                <h3 style={{display: 'flex'}}>Bienvenido a Mono React-Java Spring applicación</h3>

            </div>
            <div className={'login-form-wrapper'}>
                <Card className="login-card">
                    <h2 className="login-title">Iniciar Sesión</h2>
                    <Form
                        // labelCol={{ span: 10, offset:0 }}
                        name="basic"
                        layout="vertical"
                        initialValues={{remember: true}}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        onChange={onInputChange}
                    >
                        <Form.Item
                            label="Usuario"
                            name="username"
                            rules={[{required: true, message: "Por favor introduce tu nombre de usuario"}]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="Contraseña"
                            name="password"
                            rules={[{required: true, message: "Por favor introduce tu contraseña"}]}
                        >
                            <Input.Password/>
                        </Form.Item>

                        {/*<Form.Item name="remember" valuePropName="checked">*/}
                        {/*    <Checkbox>Remember me</Checkbox>*/}
                        {/*</Form.Item>*/}

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-button">
                                Entrar
                            </Button>
                        </Form.Item>
                    </Form>
                    <div>
                        <h3 style={{color: "red"}}>{loginFailed}</h3>
                    </div>
                </Card>

            </div>
        </div>

    );

};

export default Login;
