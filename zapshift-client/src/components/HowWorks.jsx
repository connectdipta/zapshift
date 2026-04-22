import React from 'react';
import { FiTruck, FiMapPin, FiBriefcase, FiDollarSign } from 'react-icons/fi';
import LottieAnimation from './LottieAnimation';
import riderAnimation from '../assets/animations/rider.json';
import registerAnimation from '../assets/animations/register.json';
import COD from '../assets/animations/COD.json';
import bookingSME from '../assets/animations/bookingSME.json';
import { motion } from 'framer-motion';
import { fadeUp, scaleIn, staggerContainer } from './motionPresets';

const cardData = [
  {
    icon: FiTruck,
    animation: registerAnimation,
    title: 'Booking Pick & Drop',
    description: 'Book a pickup in seconds and our delivery team collects your parcel from your doorstep.',
  },
  {
    icon: FiDollarSign,
    animation: COD,
    title: 'Cash On Delivery',
    description: 'Enable cash-on-delivery and track remittance so your payments stay transparent and secure.',
  },
  {
    icon: FiMapPin,
    animation: riderAnimation,
    title: 'Delivery Hub',
    description: 'Monitor live parcel movement through our hub network with faster routing and status updates.',
  },
  {
    icon: FiBriefcase,
    animation: bookingSME,
    title: 'Booking SME & Corporate',
    description: 'Scale with business dashboards, bulk booking tools, and dedicated support for teams.',
  },
];

const HowWorks = () => {
  return (
    <motion.section className="py-8 sm:py-10 lg:py-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.45 }}>
      <motion.h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-secondary mb-8 text-left" initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
        How it Works
      </motion.h2>
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-7 items-stretch" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
        {cardData.map((card, index) => (
          <motion.article 
            key={index} 
            className="group relative overflow-hidden bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-[0_12px_30px_rgba(3,55,61,0.08)] hover:shadow-[0_20px_38px_rgba(3,55,61,0.14)] transition-shadow duration-300 flex h-full min-h-[24rem] flex-col items-start"
            variants={scaleIn}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.35 }}
          >
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[color:color-mix(in_srgb,var(--color-primary)_35%,white)] opacity-50 transition-transform duration-300 group-hover:scale-110" />

            <div className="relative z-10 mb-4 flex h-40 w-full items-center justify-center rounded-xl bg-gray-50 border border-gray-100 p-2">
              <LottieAnimation
                animationData={card.animation}
                className="h-full w-full"
                autoplay={true}
                loop={true}
              />
            </div>

            <motion.div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,var(--color-primary)_22%,white)] text-secondary" whileHover={{ scale: 1.08 }}>
              <card.icon className="text-xl" />
            </motion.div>

            <h3 className="text-lg font-bold text-secondary mb-2 min-h-[3.5rem]">
              {card.title}
            </h3>
            <p className="text-sm sm:text-base text-tertiary leading-relaxed text-left flex-1">
              {card.description}
            </p>
          </motion.article>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default HowWorks;