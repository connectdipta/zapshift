import React from 'react';
import Banner from '../components/Banner';
import HowWorks from '../components/HowWorks';
import OurServices from '../components/OurServices';
import DeliveryFeatures from '../components/DeliveryFeatures';
import Motive from '../components/Motive';
import FAQSection from '../components/FAQSection';
import Testimonials from '../components/Testimonials';
import ClientLogos from '../components/ClientLogos';



const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <HowWorks></HowWorks>
            <ClientLogos></ClientLogos>
            <OurServices></OurServices>
            <DeliveryFeatures></DeliveryFeatures>
            <Motive></Motive>
            <Testimonials></Testimonials>
            <FAQSection></FAQSection>
            
        </div>
    );
};

export default Home;