import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

const StarIcon = ({ color, path }) => (
    <svg className={`w-4 h-4 ${color}`} fill="currentColor" viewBox="0 0 24 24">
        <path d={path}/>
    </svg>
);

const fullStarPath = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";
const halfStarPath = "M12 2l-2.73 6.42L2 9.24l5.46 4.73L5.82 21l6.18-3.72V2zm0 15.27V5.73l2.88 6.78 7.03.6-5.46 4.73 1.64 7.03L12 17.27z";

const ReviewCard = ({ review }) => {
    const { userName, review: testimonial, user_photoURL, title = 'Senior Product Designer', ratings = 0 } = review;

    const renderStars = (rating) => {
        const roundedRating = Math.round(rating * 2) / 2;
        const fullStars = Math.floor(roundedRating);
        const hasHalfStar = roundedRating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(<StarIcon key={`full-${i}`} color="text-yellow-400" path={fullStarPath} />);
        }

        if (hasHalfStar) {
            stars.push(<StarIcon key="half" color="text-yellow-400" path={halfStarPath} />);
        }

        for (let i = 0; i < emptyStars; i++) {
            stars.push(<StarIcon key={`empty-${i}`} color="text-gray-300" path={fullStarPath} />);
        }

        return <div className="flex items-center justify-center space-x-0.5">{stars}</div>;
    };

    return (
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 h-full text-left">
            <FaQuoteLeft className="text-teal-500 text-2xl mb-4 opacity-70" />
            
            <p className="mb-4 text-gray-700 italic">{testimonial}</p>
            
            {ratings > 0 && <div className="mb-4">{renderStars(ratings)}</div>}

            <div className="border-t border-dashed border-gray-300 my-4"></div>

            <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex-shrink-0">
                    <img 
                        src={user_photoURL} 
                        alt={userName} 
                        className="w-full h-full object-cover rounded-full ring-2 ring-teal-500" 
                    />
                </div>
                
                <div>
                    <h3 className="font-semibold text-lg text-gray-900">{userName}</h3>
                    <p className="text-sm text-teal-600">{title}</p>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
