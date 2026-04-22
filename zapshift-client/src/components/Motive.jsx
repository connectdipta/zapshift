import React from 'react';
import { Link } from 'react-router';
// Assuming these paths are correct for your project structure
import rightimg from '../assets/location-merchant.png'; 
import toppng from '../assets/be-a-merchant-bg.png';
import { motion } from 'framer-motion';

const Motive = () => {
    return (
        <motion.section className="p-4 md:p-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5 }}>
            <motion.div 
                className="relative max-w-7xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-secondary"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
            >
                <img 
                    src={toppng} 
                    alt="Background graphic" 
                    className="absolute top-0 left-0 w-full h-auto object-cover opacity-50"
                />

                <div className="relative p-8 md:p-16 flex flex-col md:flex-row items-center justify-between z-10">
                    
                    <div className="md:w-3/5 text-white text-center md:text-left mb-8 md:mb-0">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
                            Merchant and Customer Satisfaction <span className="block">is Our First Priority</span>
                        </h2>
                        <p className="text-base text-tertiary mb-8 max-w-lg mx-auto md:mx-0">
                            We offer the lowest delivery charge with the highest value along with 100% safety of your product. Pathao courier delivers your parcels in every corner of Bangladesh right on time.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <motion.div whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                            <Link 
                                to="/register" 
                                className="active:scale-95 inline-block px-8 py-3 rounded-full text-lg font-semibold transition-colors duration-300 bg-primary hover:bg-gray-400"
                                style={{ color: '#133330' }}
                            >
                                Become a Merchant
                            </Link>
                            </motion.div>
                            
                            <motion.div whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                            <Link 
                                to="/rider" 
                                className="active:scale-95  inline-block px-8 py-3 rounded-full text-lg font-semibold border-2 border-primary text-primary transition-colors duration-300 hover:bg-white hover:text-black"
                            >
                                Earn with ZapShift Courier
                            </Link>
                            </motion.div>
                        </div>
                    </div>

                    <div className="md:w-2/5 flex justify-center md:justify-end min-h-[250px] relative">
                        <img 
                            src={rightimg} 
                            alt="Parcels and location pin illustration" 
                            className="w-full max-w-sm h-auto object-contain"
                        />
                    </div>
                </div>
            </motion.div>
        </motion.section>
    );
};

export default Motive;