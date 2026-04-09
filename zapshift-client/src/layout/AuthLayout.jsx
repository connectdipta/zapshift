import React from 'react';
import Logo from '../components/Logo';
import { Link, Outlet } from 'react-router';
import authImg from "../assets/authImage.png"
import RouteTransition from '../components/RouteTransition';

const AuthLayout = () => {
    return (
        <div className="w-full h-screen bg-white">
            <div className="flex h-full">

                <div className="flex-1 flex flex-col h-full bg-white px-8 lg:px-20 xl:px-32">

                    <div className="pt-10">
                        <Link to="/">
                            <Logo />
                        </Link>
                    </div>

                    <div className="flex-1 flex items-center justify-center">
                        <div className='w-full max-w-[400px]'>
                            <RouteTransition>
                                <Outlet />
                            </RouteTransition>
                        </div>
                    </div>

                </div>

                <div className="flex-1 bg-[#FAFDF0] h-full max-sm:hidden flex justify-center items-center relative">
                    <img src={authImg} alt="Auth Illustration" className="w-4/5 max-w-lg object-contain" />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;