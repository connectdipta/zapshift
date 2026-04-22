import React from 'react';
import Banner from '../../components/Banner';
import HowWorks from '../../components/HowWorks';
import OurServices from '../../components/OurServices';
import DeliveryFeatures from '../../components/DeliveryFeatures';
import Motive from '../../components/Motive';
import FAQSection from '../../components/FAQSection';
import Testimonials from '../../components/Testimonials';
import ClientLogos from '../../components/ClientLogos';
import { motion } from 'framer-motion';
import { staggerContainer } from '../../components/motionPresets';



const Home = () => {
    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.5 }}>
                <Banner />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.5 }}>
                <HowWorks />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.5 }}>
                <ClientLogos />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.5 }}>
                <OurServices />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.5 }}>
                <DeliveryFeatures />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.5 }}>
                <Motive />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.5 }}>
                <Testimonials />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.5 }}>
                <FAQSection />
            </motion.div>
            
        </motion.div>
    );
};

export default Home;