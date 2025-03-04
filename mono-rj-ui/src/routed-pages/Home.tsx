import React, {useEffect, useState} from 'react';

import {Button, Layout, Menu, MenuProps, Select} from 'antd';
import caserLogo from '../images/caser_logo.png';
import {IHomeState} from './HomeContainer';
import Page1 from '../pages/Page1';
import Page2 from '../pages/Page2';
import Page3 from '../pages/Page3';
import LoginContainer from "./LoginContainer";
import {UsersContainer} from "../users/UsersContainer";
import {jwtDecode} from 'jwt-decode';
import {useNavigate} from "react-router-dom";
import {useAppMonoRJContext} from "../MonoRJAppContext";


interface IProps extends IHomeState {
}

interface DecodedToken {
    role: string;
    sub: string;  //username
    // add other fields as needed
}

const Home = (props: IProps) => {

    const {Header, Footer} = Layout;
    const menuItems = [{key: '1', label: 'Menu page 1'}, {key: '2', label: 'Menu page 2'},
        {key: '3', label: 'Menu page 3',},
        // {key: '4', label: 'Ajustes',}
    ];
    const [menuKeyItem, setMenuKeyItem] = useState<string>('2');
    const [savedMenuKeyItem, setSavedMenuKeyItem] = useState<string>('');
    const [showMainContent, setShowMainContent] = useState<boolean>(true);
    const [btnCaptionSwitch, setBtnCaptionSwitch] = useState<string>('Gestión de usuarios');
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<string>("");
    const {logout} = useAppMonoRJContext(); // Get logout function from context
    const navigate = useNavigate();
    const token = localStorage.getItem('jwtToken');


    useEffect(() => {
        if (props.navTo !== "") {
            navigate(props.navTo);
            return;
        }

        if (token) {
            try {
                // Decode the token
                const decoded = jwtDecode<DecodedToken>(token);
                // Check if the role is admin (ensure consistent case, e.g., uppercase)
                if (decoded.role && decoded.role.toUpperCase() === 'ROLE_ADMIN') {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }

                if (decoded.sub) {
                    setCurrentUser(decoded.sub);
                } else {
                    setCurrentUser("No hay usuario");
                }
            } catch (error) {
                console.error('Failed to decode token', error);
                navigate(props.navTo);

            }
        }
    }, [token, navigate, props.navTo]);


    const onMenuItemClick: MenuProps['onClick'] = (e: any) => {
        setMenuKeyItem(e.key);
        setShowMainContent(true);
    };


    const showUserPage = () => {
        setShowMainContent(!showMainContent);
        if (menuKeyItem === '') {
            setBtnCaptionSwitch('Gestión de usuarios')
            setMenuKeyItem(savedMenuKeyItem);
        } else {
            setSavedMenuKeyItem(menuKeyItem);
            setMenuKeyItem('');
            setBtnCaptionSwitch('Volver a la aplicación')
        }
    }

    const disconnect = () => {
        // Remove the auth token from localStorage
        localStorage.removeItem("jwtToken");
        // Update authentication state
        logout();
        // Redirect to the login page
        navigate("/login");
    };
    return (
        <Layout>
            <Header className={'select-header'}>
                <div style={{display: 'flex'}}>
                    <h1>Your logo here</h1>
                </div>
                {(menuKeyItem !== '') && <Menu
                    onClick={onMenuItemClick}
                    theme='light'
                    mode='horizontal'
                    defaultSelectedKeys={['1']}
                    selectedKeys={[menuKeyItem]}
                    items={menuItems}
                    style={{flex: 'auto', minWidth: 0, fontWeight: 'bold'}}
                />}
                <div style={{display: 'flex', marginLeft: 'auto', alignItems: 'center'}}>
                    <span style={{marginLeft: 'auto', marginRight: '10px'}}>{`Usuario: ${currentUser} `}</span>
                    <Button type='primary' style={{marginLeft: 'auto', minWidth: '150px'}} className={'conf-test-btn'}
                            onClick={disconnect}>Cerrar sesión</Button>
                    {isAdmin &&
                        <Button type='primary' style={{marginLeft: 'auto', minWidth: '150px'}}
                                className={'conf-test-btn'}
                                onClick={showUserPage}>{btnCaptionSwitch}</Button>
                    }
                </div>
            </Header>
            {!showMainContent && <div className={'home-select-div'}>
                <UsersContainer
                    visible={showMainContent}
                />
            </div>}
            <div className={'home-content-div'} style={{display: showMainContent ? 'flex' : 'none'}}>
                <div className={'home-select-div'}>
                    <h3>Some components here</h3>
                </div>
            </div>
            <div style={{display: showMainContent ? 'flex' : 'none', height: '100%', overflow: "hidden"}}>
                {menuKeyItem === '1' &&
                    <Page1
                        setMenuKeyItem={setMenuKeyItem}
                    />
                }
                {menuKeyItem === '2' &&
                    <Page2
                        setMenuKeyItem={setMenuKeyItem}
                    />
                }
                {menuKeyItem === '3' &&
                    <Page3
                    />
                }
                {
                    menuKeyItem === '4' &&
                    <LoginContainer
                    />
                }
            </div>
            <Footer style={{textAlign: 'center', position: 'sticky', bottom: '0'}}>
                Mono RJ {new Date().getFullYear()} Created by...
            </Footer>
        </Layout>
    );
};

export default Home;
