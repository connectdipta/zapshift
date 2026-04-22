import React from 'react';
import Logo from '../components/Logo';
import { Link, Outlet } from 'react-router';
import authImg from "../assets/authImage.png"
import RouteTransition from '../components/RouteTransition';
import { motion } from 'framer-motion';
import { fadeUp, scaleIn } from '../components/motionPresets';

const AuthLayout = () => {
    return (
        <div className="w-full h-screen bg-white">
            <div className="flex h-full">

                <motion.div
                  className="flex-1 flex flex-col h-full bg-white px-8 lg:px-20 xl:px-32"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >

                    <motion.div className="pt-10" variants={scaleIn} initial="hidden" animate="visible" transition={{ duration: 0.45 }}>
                        <Link to="/">
                            <Logo />
                        </Link>
                    </motion.div>

                    <div className="flex-1 flex items-center justify-center">
                        <motion.div className='w-full max-w-[400px]' variants={scaleIn} initial="hidden" animate="visible" transition={{ duration: 0.55, delay: 0.05 }}>
                            <RouteTransition>
                                <Outlet />
                            </RouteTransition>
                        </motion.div>
                    </div>

                </motion.div>

                <motion.div
                  className="flex-1 bg-[#FAFDF0] h-full max-sm:hidden flex justify-center items-center relative"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    <img src={authImg} alt="Auth Illustration" className="w-4/5 max-w-lg object-contain" />
                </motion.div>
            </div>
        </div>
    );
};

export default AuthLayout;