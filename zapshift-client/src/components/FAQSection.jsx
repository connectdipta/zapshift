import React, { useState } from 'react';
import { FiChevronUp, FiChevronDown, FiArrowRight } from 'react-icons/fi';

const faqData = [
  {
    question: "How does this posture corrector work?",
    answer:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day. Here's how it typically functions: A posture corrector works by providing support and gentle alignment to your shoulders.",
  },
  {
    question: "Is it suitable for all ages and body types?",
    answer:
      "Most posture correctors are designed to be adjustable and fit a wide range of body types. However, children, pregnant women, and individuals with serious existing medical conditions should consult a doctor before use.",
  },
  {
    question: "Does it really help with back pain and posture improvement?",
    answer:
      "Yes, consistent use can significantly improve posture by retraining muscle memory. It can also help relieve certain types of back pain caused by slouching or poor sitting habits.",
  },
  {
    question: "Does it have smart features like vibration alerts?",
    answer:
    "Some premium models include smart features like vibration alerts that trigger when you start slouching, encouraging immediate self-correction. Check the specific product features for details.",
  },
  {
    question: "How will I be notified when the product is back in stock?",
    answer:
    "You can sign up for a back-in-stock notification on the product page. We will send you an email alert as soon as the item is available for purchase again.",
  },
  {
    question: "What is your return policy for posture correctors?",
    answer: "We offer a 30-day money-back guarantee. If you are not satisfied with your purchase, you can return it within 30 days for a full refund.",
  },
  {
    question: "How long should I wear the posture corrector each day?",
    answer: "It is generally recommended to start with 30 minutes to an hour per day and gradually increase the duration as your body adjusts. Avoid wearing it for more than 4 hours straight.",
  },
  {
    question: "Can I wear it under my clothes?",
    answer: "Yes, most of our models are designed to be slim and discreet, allowing them to be comfortably worn under loose-fitting clothing.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we offer worldwide shipping. Shipping costs and delivery times vary based on the destination country.",
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
    <section className="bg-gray-50 py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-secondary tracking-wide">
            Frequently Asked Question (FAQ)
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!
          </p>
        </div>

        <div className="space-y-4">
          {faqData.slice(0, visibleCount).map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`
                  bg-white rounded-lg shadow-sm overflow-hidden border-2 
                  ${isOpen ? 'border-teal-300' : 'border-gray-200'}
                  transition-all duration-300 transform group
                  opacity-100 translate-y-0
                `}

                data-aos="fade-up"
              >
                <button
                  className={`
                    w-full flex justify-between items-center p-5 text-left font-semibold 
                    ${isOpen ? 'text-teal-700 bg-teal-50' : 'text-gray-700 hover:bg-gray-50'}
                  `}
                  onClick={() => toggleFAQ(index)}
                >
                  {item.question}
                  {isOpen ? (
                    <FiChevronUp className="text-xl transition-transform duration-300" />
                  ) : (
                    <FiChevronDown className="text-xl transition-transform duration-300" />
                  )}
                </button>

                <div
                  className={`
                    transition-all duration-500 ease-in-out overflow-hidden
                    ${isOpen ? 'max-h-96 opacity-100 p-5 pt-0' : 'max-h-0 opacity-0 p-0'}
                  `}
                >
                  <p className="text-tertiary text-sm border-t border-gray-200 pt-5">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {isShowMoreVisible && (
          <div className="flex justify-center mt-12 transition-opacity duration-500">
            <button
              onClick={handleShowMore}
              className="flex items-center gap-2 px-8 py-3 rounded-full text-lg font-semibold text-gray-800 transition-shadow duration-300 shadow-md hover:shadow-lg"
              style={{ backgroundColor: '#B8EA5C' }}
            >
              See More FAQ's
              <FiArrowRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;