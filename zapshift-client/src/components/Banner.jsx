import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import banner1 from '../assets/banner/banner1.png'
import banner2 from '../assets/banner/banner2.png'
import banner3 from '../assets/banner/banner3.png'

const Banner = () => {
    return (
       <Carousel autoPlay={true}
                 infiniteLoop={true}
                 stopOnHover={true}>
                <div>
                    <img src={banner1} />
                </div>
                <div>
                    <img src={banner2} />
                </div>
                <div>
                    <img src={banner3} />
                </div>
     </Carousel>
    );
};

export default Banner;