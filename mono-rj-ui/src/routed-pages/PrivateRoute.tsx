import React, { FC, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ children }): ReactElement => {
    const token = localStorage.getItem('jwtToken');
    return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
