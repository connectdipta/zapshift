import React from 'react';
import { FiTruck, FiMapPin, FiBriefcase, FiDollarSign } from 'react-icons/fi';

const cardData = [
  {
    icon: FiTruck,
    title: 'Booking Pick & Drop',
    description: 'From personal packages to business shipments — we deliver on time, every time.',
  },
  {
    icon: FiDollarSign,
    title: 'Cash On Delivery',
    description: 'From personal packages to business shipments — we deliver on time, every time.',
  },
  {
    icon: FiMapPin,
    title: 'Delivery Hub',
    description: 'From personal packages to business shipments — we deliver on time, every time.',
  },
  {
    icon: FiBriefcase,
    title: 'Booking SME & Corporate',
    description: 'From personal packages to business shipments — we deliver on time, every time.',
  },
];

const HowWorks = () => {
  return (
    <div className="py-8 sm:py-10 lg:py-12 px-3 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-secondary mb-8 text-left">
        How it Works
      </h2>
      <div className="flex flex-wrap justify-center gap-4 sm:gap-5 lg:gap-7">
        {cardData.map((card, index) => (
          <div 
            key={index} 
            className="bg-white p-5 sm:p-6 rounded-xl shadow-lg w-full sm:w-72 md:w-64 lg:w-60 flex flex-col items-start"
            style={{ minHeight: '10rem' }}
          >
            <card.icon className="text-4xl text-secondary mb-3" />
            <h3 className="text-lg font-bold text-secondary mb-2">
              {card.title}
            </h3>
            <p className="text-normal text-tertiary leading-relaxed text-left">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowWorks;