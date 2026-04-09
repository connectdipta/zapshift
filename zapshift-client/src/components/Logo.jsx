import React from 'react';
import logo from '../assets/logo.png';

const Logo = ({ compact = false }) => {
    return (
        <div className={`flex items-end active:scale-95 transition-transform duration-150 ${compact ? "justify-center" : ""}`}>
            <img src={logo} alt="logo" className={compact ? "h-8 w-8" : ""} />
            {!compact && <h3 className="text-3xl font-bold -ms-3">ZapShift</h3>}
        </div>
    );
};

export default Logo;