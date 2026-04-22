import React from 'react';
import {
  FaTruckFast,
  FaMapLocationDot,
  FaBoxesPacking,
  FaMoneyBillWave,
  FaWarehouse,
  FaRotateLeft,
} from 'react-icons/fa6';

const serviceCards = [
  {
    icon: FaTruckFast,
    title: 'Express & Standard Delivery',
    description: 'We deliver parcels within 24-72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4-6 hours from pick-up to drop-off.',
    isHighlighted: false,
  },
  {
    icon: FaMapLocationDot,
    title: 'Nationwide Delivery',
    description: 'We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48-72 hours.',
    isHighlighted: true, 
  },
  {
    icon: FaBoxesPacking,
    title: 'Fulfillment Solution',
    description: 'We also offer customized service with inventory management support, online order processing, packaging, and after sales support.',
    isHighlighted: false,
  },
  {
    icon: FaMoneyBillWave,
    title: 'Cash on Home Delivery',
    description: '100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.',
    isHighlighted: false,
  },
  {
    icon: FaWarehouse,
    title: 'Corporate Service / Contract In Logistics',
    description: 'Customized corporate services which includes warehouse and inventory management support.',
    isHighlighted: false,
  },
  {
    icon: FaRotateLeft,
    title: 'Parcel Return',
    description: 'Through our reverse logistics facility we allow and customers to return or exchange their products with online business merchants.',
    isHighlighted: false,
  },
];

const OurServices = () => {
  return (
    <section className="bg-secondary py-16 px-4 sm:px-6 lg:px-8 rounded-4xl">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-extrabold text-white mb-4">Our Services</h2>
        <p className="textarea-md text-gray-500 max-w-2xl mx-auto">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {serviceCards.map((card, index) => {
          const ServiceIcon = card.icon;
          return (
            <div
              key={index}
              className="relative p-8 rounded-xl shadow-lg flex flex-col items-center text-left bg-white hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out hover:bg-primary h-70"
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--color-primary)_22%,white)] text-[var(--color-primary)]">
                <ServiceIcon className="text-3xl" />
              </div>

              <h3 className="textarea-xl font-bold text-secondary mb-3">
                {card.title}
              </h3>
              <p className="text-tertiary textarea-md">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default OurServices;