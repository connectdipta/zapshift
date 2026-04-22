import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/Footer';
import RouteTransition from '../components/RouteTransition';
import { motion } from 'framer-motion';
import { fadeUp } from '../components/motionPresets';

const RootLayout = () => {
    return (
        <div>
            <Navbar />
            <motion.div
              className="w-10/12 mx-auto max-sm:w-11/12"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
                <RouteTransition>
                    <Outlet />
                </RouteTransition>
            </motion.div>
            <Footer />
        </div>
    );
};

export default RootLayout;