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
    <div className=" py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-secondary mb-8 text-left">
        How it Works
      </h2>
      <div className="flex flex-wrap justify-center gap-7">
        {cardData.map((card, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-xl shadow-lg w-full sm:w-60 flex flex-col items-start"
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