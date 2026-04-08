import React from 'react';
// Assuming these paths are correct for your project structure
import rightimg from '../assets/location-merchant.png'; 
import toppng from '../assets/be-a-merchant-bg.png';

const Motive = () => {
    return (
        <section className="p-4 md:p-8">
            <div 
                className="relative max-w-7xl mx-auto rounded-xl overflow-hidden shadow-2xl bg-secondary"
            >
                <img 
                    src={toppng} 
                    alt="Background graphic" 
                    className="absolute top-0 left-0 w-full h-auto object-cover opacity-50"
                />

                <div className="relative p-8 md:p-16 flex flex-col md:flex-row items-center justify-between z-10">
                    
                    <div className="md:w-3/5 text-white text-center md:text-left mb-8 md:mb-0">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
                            Merchant and Customer Satisfaction <span className="block">is Our First Priority</span>
                        </h2>
                        <p className="text-base text-tertiary mb-8 max-w-lg mx-auto md:mx-0">
                            We offer the lowest delivery charge with the highest value along with 100% safety of your product. Pathao courier delivers your parcels in every corner of Bangladesh right on time.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <a 
                                href="#" 
                                className="active:scale-95 inline-block px-8 py-3 rounded-full text-lg font-semibold transition-colors duration-300 bg-primary hover:bg-gray-400"
                                style={{ color: '#133330' }}
                            >
                                Become a Merchant
                            </a>
                            
                            <a 
                                href="#" 
                                className="active:scale-95  inline-block px-8 py-3 rounded-full text-lg font-semibold border-2 border-primary text-primary transition-colors duration-300 hover:bg-white hover:text-black"
                            >
                                Earn with ZapShift Courier
                            </a>
                        </div>
                    </div>

                    <div className="md:w-2/5 flex justify-center md:justify-end min-h-[250px] relative">
                        <img 
                            src={rightimg} 
                            alt="Parcels and location pin illustration" 
                            className="w-full max-w-sm h-auto object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Motive;