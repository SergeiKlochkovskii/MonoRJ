import React from 'react';
import caserLogo from "../images/caser_logo.png"; // ✅ Import the CSS file
import './Login.css';
import {useNavigate} from "react-router-dom";
import {Button} from "antd";

const NotFound = (
    props: {},
) => {

    const navigate = useNavigate();


    return (
        <div style={{display: 'flex', justifyContent: 'top', width: '100%', flexDirection: 'column'}}>
            <div className={'login-logo'}>
                <img src={caserLogo} alt="Caser Logo"/>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'center', width: '100%', backgroundColor: '#dde9ea',
                paddingTop: '10px'
            }}>
                <h3 style={{display: 'flex'}}>Página no encontrada</h3>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Button
                    style={{width: 'auto'}}
                    type="primary" htmlType="submit" className="login-button"
                    onClick={() => navigate('/')}
                >
                    Volver a la página principal
                </Button>
            </div>
        </div>

    );
};

export default NotFound;