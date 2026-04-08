import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router';
import { useLocation } from 'react-router';
import LottieAnimation from '../components/LottieAnimation';
import loadingAnimation from '../assets/animations/loading.json';

const PrivateRoute = ({children}) => {
    const {user, loading} = useAuth();
    const location = useLocation()
    if(loading){
        return <div className="flex justify-center items-center min-h-screen">
            <LottieAnimation animationData={loadingAnimation} className="w-24 h-24" />
        </div>
    }

    if(!user){
        return <Navigate state={location.pathname} to = "/login"></Navigate>
    }

    return children;
};

export default PrivateRoute;