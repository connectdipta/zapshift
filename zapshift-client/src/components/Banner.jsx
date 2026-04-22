import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import banner1 from '../assets/banner/banner1.png'
import banner2 from '../assets/banner/banner2.png'
import banner3 from '../assets/banner/banner3.png'
import { motion } from 'framer-motion';

const Banner = () => {
    return (
       <motion.section initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55 }}>
       <Carousel autoPlay={true}
                 infiniteLoop={true}
                 stopOnHover={true}
                 showThumbs={false}
                 showStatus={false}
                 swipeable={true}
                 emulateTouch={true}>
                <div>
                    <img src={banner1} alt="ZapShift banner slide 1" className="w-full object-cover" />
                </div>
                <div>
                    <img src={banner2} alt="ZapShift banner slide 2" className="w-full object-cover" />
                </div>
                <div>
                    <img src={banner3} alt="ZapShift banner slide 3" className="w-full object-cover" />
                </div>
     </Carousel>
     </motion.section>
    );
};

export default Banner;