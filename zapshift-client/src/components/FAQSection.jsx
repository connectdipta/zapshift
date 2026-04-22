import React, { useState } from 'react';
import { FiChevronUp, FiChevronDown, FiArrowRight } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';

const faqData = [
  {
    question: "How long does it take to deliver a parcel?",
    answer:
      "For inside Dhaka, we deliver within 24 hours. For outside Dhaka, it usually takes 48 to 72 hours depending on the distance and coverage area.",
  },
  {
    question: "How can I track my parcel?",
    answer:
      "You can track your parcel by entering your 6-digit tracking number or Parcel ID in the 'Track Parcel' section of our website or dashboard.",
  },
  {
    question: "What are your delivery charges?",
    answer:
      "Our delivery charges depend on the weight of the parcel and the delivery location. You can find a detailed breakdown in our 'Pricing' section.",
  },
  {
    question: "Do you offer Cash on Delivery (COD)?",
    answer:
    "Yes, we offer nationwide Cash on Delivery service. We collect the payment from the receiver and disburse it to the sender's account securely.",
  },
  {
    question: "How do I become a rider for ZapShift?",
    answer:
    "You can apply to be a rider by clicking the 'Be a Rider' link in the navbar. Fill out the application form with your details and NID, and our team will review your application.",
  },
  {
    question: "What should I do if my parcel is damaged?",
    answer: "We take extreme care with every parcel. However, if any damage occurs during transit, please contact our support team immediately with your tracking number and photos of the damage.",
  },
  {
    question: "Can I cancel a delivery request?",
    answer: "You can cancel a delivery request from your dashboard as long as the parcel has not been picked up by a rider yet.",
  },
  {
    question: "Do you provide international shipping?",
    answer: "Currently, we only operate within Bangladesh. We are working on expanding our services to international destinations in the future.",
  },
];

const INITIAL_VISIBLE_COUNT = 5;

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0); 
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleShowMore = () => {
    setVisibleCount(faqData.length); 
  };
  
  const isShowMoreVisible = visibleCount < faqData.length;

  return (
    <motion.section className="bg-gray-50 py-12 sm:py-16 px-4 md:px-8 rounded-3xl sm:rounded-[3rem] mt-4" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }}>
      <div className="max-w-7xl mx-auto px-4">
        
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#103d45] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about our parcel delivery services, tracking, and rider opportunities.
          </p>
        </motion.div>

        <div className="space-y-3 sm:space-y-4">
          {faqData.slice(0, visibleCount).map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div 
                key={index} 
                className={`
                  bg-white rounded-2xl shadow-sm overflow-hidden border-2 
                  ${isOpen ? 'border-[#b8d94a]' : 'border-gray-100'}
                  transition-all duration-300
                `}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
              >
                <button
                  className={`
                    w-full flex justify-between items-center gap-4 p-4 sm:p-6 text-left font-bold 
                    ${isOpen ? 'text-[#103d45] bg-[#faffed]' : 'text-gray-700 hover:bg-gray-50'}
                  `}
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-sm sm:text-base">{item.question}</span>
                  {isOpen ? (
                    <FiChevronUp className="text-xl shrink-0 transition-transform duration-300" />
                  ) : (
                    <FiChevronDown className="text-xl shrink-0 transition-transform duration-300" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="text-gray-600 text-sm border-t border-gray-100 p-4 sm:p-6 leading-relaxed">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
        
        {isShowMoreVisible && (
          <motion.div className="flex justify-center mt-10" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <motion.button
              onClick={handleShowMore}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full text-sm sm:text-base font-bold text-[#1c2d1a] transition-all shadow-md hover:shadow-xl hover:brightness-95 active:scale-95"
              style={{ backgroundColor: '#B8D94A' }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              See More FAQ's
              <FiArrowRight />
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default FAQSection;