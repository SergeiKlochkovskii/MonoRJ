import React from 'react';
import Home from './Home';
import {TuxedoServiceInfo} from '../data/TuxedoServiceInfo';
import axios from 'axios';
import {axiosInstance} from "../pages/fun";
import {useNavigate} from "react-router-dom";

export interface IHomeState {
    navTo: string;
}

class HomeContainer extends React.Component {

    public state: IHomeState = {
        navTo: "",
    };



    public componentDidMount() {
        this.loadData();
    }


    loadData = () => {
        this.setState({dataLoaded: false});

        ///////
        this.setState({dataLoaded: true});

    };

    render() {
        return (
            <div style={{display: 'flex', width: '100%'}}>
                <Home
                    {...this.state}
                />
            </div>
        );
    }
}

export default HomeContainer;