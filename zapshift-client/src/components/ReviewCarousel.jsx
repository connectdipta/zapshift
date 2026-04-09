import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules'; 
import ReviewCard from './ReviewCard';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

const ReviewCarousel = () => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch('/reviews.json');
                if (!res.ok) throw new Error('Failed to fetch reviews');
                const data = await res.json();
                setReviews(data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReviews();
    }, []);

    if (isLoading) {
        return <p className="text-center py-10 text-gray-600">Loading reviews...</p>;
    }

    if (!reviews || reviews.length === 0) {
        return <p className="text-center py-10 text-gray-600">No reviews to display.</p>;
    }

    return (
        <Swiper
            loop={true}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={1}
            breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            }}
            coverflowEffect={{
                rotate: 0, 
                stretch: 0, 
                depth: 100,
                modifier: 1, 
                scale: 0.9, 
                slideShadows: false,
            }}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            className="mySwiper pt-10 pb-16"
        >
            {reviews.map(review => (
                <SwiperSlide key={review.id}>
                    <ReviewCard review={review} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default ReviewCarousel;
