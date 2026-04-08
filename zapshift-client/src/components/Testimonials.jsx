import React from 'react';
import testimonialIllustration from '../assets/customer-top.png'; 
import ReviewCarousel from './ReviewCarousel'; 

const Testimonials = () => {

    return (
        <section className="bg-gray-100 py-16 px-4 md:px-8">
            <div className="max-w-6xl mx-auto text-center">
                
                <div className="mb-8">
                    <img 
                        src={testimonialIllustration} 
                        alt="Boxes on a dolly cart illustration" 
                        className="h-28 w-auto object-contain mx-auto"
                    />
                </div>

                <h2 className="text-3xl md:text-4xl font-extrabold text-secondary tracking-wide mb-4">
                    What our customers are saying
                </h2>
                <p className="mt-2 textarea-md text-tertiary max-w-2xl mx-auto mb-12">
                    Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!
                </p>

                <ReviewCarousel />

            </div>
        </section>
    );
};

export default Testimonials;