import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import banner1 from '../assets/banner/banner1.png'
import banner2 from '../assets/banner/banner2.png'
import banner3 from '../assets/banner/banner3.png'

const Banner = () => {
    return (
       <Carousel
         autoPlay={true}
         infiniteLoop={true}
         stopOnHover={true}
         showStatus={false}
         showThumbs={false}
         className="overflow-hidden"
       >
         <div>
           <img src={banner1} className="w-full h-auto object-cover" />
         </div>
         <div>
           <img src={banner2} className="w-full h-auto object-cover" />
         </div>
         <div>
           <img src={banner3} className="w-full h-auto object-cover" />
         </div>
       </Carousel>
    );
};

export default Banner;