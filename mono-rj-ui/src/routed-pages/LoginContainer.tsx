import React, {Component} from 'react';
import Login from "./Login";

class LoginContainer extends Component {

    constructor(props: any) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // alert('Mounting settings');
    }

    componentWillUnmount() {
        // alert('Unmounting settings');
    }


    render() {
        return (
            <Login

            />


        );
    }
}

export default LoginContainer;