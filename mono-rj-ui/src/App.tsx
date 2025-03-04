import React from 'react';
import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import NotFound from './routed-pages/NotFound';
import HomeContainer from './routed-pages/HomeContainer';
import Login from "./routed-pages/Login";
import PrivateRoute from "./routed-pages/PrivateRoute";
import {MonoRJAppProvider} from './MonoRJAppContext'

function App() {
    return (
        <MonoRJAppProvider>
            <div className="App">
                <BrowserRouter basename="/mono">
                    <Routes>
                        <Route path="/" element={
                            <PrivateRoute>
                                <HomeContainer/>
                            </PrivateRoute>
                        }/>
                        {/* Public routes */}
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/notfound" element={<NotFound/>}/>
                        {/* Catch-all */}
                        <Route path="*" element={<Navigate to="/notfound" replace/>}/>
                    </Routes>
                </BrowserRouter>
            </div>
        </MonoRJAppProvider>
    );
}

export default App;
