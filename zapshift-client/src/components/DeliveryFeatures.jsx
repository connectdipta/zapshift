import React from "react";
import image1 from '../assets/live-tracking.png'
import image2 from '../assets/safe-delivery.png'
import { FiHeadphones } from 'react-icons/fi'; 

const features = [
  {
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment’s journey and get instant status updates for complete peace of mind.",
    image: image1,
    IconComponent: null,
  },
  {
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    image: image2,
    IconComponent: null,
  },
  {
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
    image: null,
    IconComponent: FiHeadphones,
  },
];

const DeliveryFeatures = () => {
  return (
    <section className="bg-gray-50 py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        
        <div className="border-t-2 border-dashed border-gray-300 mb-10"></div>

        {features.map((feature, index) => (
          <div
            key={index}
            className={`
              my-4 relative flex flex-col md:flex-row items-center md:items-start 
              bg-white p-6 md:p-0 rounded-xl shadow-md transition-shadow duration-300
              
              ${index > 0 ? 'mt-8' : ''} 
            `}
            style={{ borderRadius: '15px', overflow: 'hidden' }}
          >
            
            <div 
              className="flex-shrink-0 w-full md:w-1/4 mb-4 md:mb-0 flex justify-center items-center py-6 md:py-10 
                       md:border-r-2 md:border-dashed md:border-gray-300"
            >
              {feature.image && (
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="h-28 w-auto object-contain"
                />
              )}
              {feature.IconComponent && (
                <feature.IconComponent className="text-8xl text-secondary opacity-75" />
              )}
            </div>

            <div className="md:pl-8 flex-grow w-full md:w-3/4 text-center md:text-left p-6 md:p-10 pt-0 md:pt-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
            
            {index < features.length - 1 && (
                <div className="absolute bottom-[-1.5rem] left-0 right-0 h-px mx-auto max-w-[90%] border-t border-gray-200"></div>
            )}
          </div>
        ))}

        <div className="border-b-2 border-dashed border-gray-300 mt-10"></div>

      </div>
    </section>
  );
};

export default DeliveryFeatures;