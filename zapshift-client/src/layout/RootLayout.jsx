import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/Footer';

const RootLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className="max-w-10/12 mx-auto max-sm:max-w-11/12"><Outlet></Outlet></div>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;