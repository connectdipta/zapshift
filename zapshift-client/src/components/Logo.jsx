import React from 'react';
import logo from '../assets/logo.png';

const Logo = () => {
    return (
        <div className="flex items-end active:scale-95 transition-transform duration-150">
            <img src={logo} alt="logo" />
            <h3 className="text-3xl font-bold -ms-3">ZapShift</h3>
        </div>
    );
};

export default Logo;