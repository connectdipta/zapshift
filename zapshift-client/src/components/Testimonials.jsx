import React from 'react';
import testimonialIllustration from '../assets/customer-top.png'; 
import ReviewCarousel from './ReviewCarousel'; 
import { motion } from 'framer-motion';

const Testimonials = () => {

    return (
        <motion.section className="bg-gray-100 py-16 px-4 md:px-8" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }}>
            <div className="max-w-6xl mx-auto text-center">
                
                <motion.div className="mb-8" initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
                    <img 
                        src={testimonialIllustration} 
                        alt="Boxes on a dolly cart illustration" 
                        className="h-28 w-auto object-contain mx-auto"
                    />
                </motion.div>

                <motion.h2 className="text-3xl md:text-4xl font-extrabold text-secondary tracking-wide mb-4" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.05 }}>
                    What our customers are saying
                </motion.h2>
                <motion.p className="mt-2 textarea-md text-tertiary max-w-2xl mx-auto mb-12" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.1 }}>
                    Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!
                </motion.p>

                <ReviewCarousel />

            </div>
        </motion.section>
    );
};

export default Testimonials;