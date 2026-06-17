"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

// Official Google "G" Icon
const GoogleIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M23.49 12.275c0-.812-.07-1.605-.2-2.365H12v4.473h6.443c-.28 1.442-1.077 2.664-2.28 3.48v2.883h3.69c2.16-1.99 3.407-4.916 3.407-8.47Z"
      fill="#4285F4"
    />
    <path
      d="M12 24c3.24 0 5.95-1.075 7.93-2.915l-3.69-2.883c-1.07.72-2.44 1.145-4.24 1.145-3.268 0-6.033-2.203-7.02-5.163H1.162v2.983C3.136 21.082 7.218 24 12 24Z"
      fill="#34A853"
    />
    <path
      d="M4.98 14.184A6.877 6.877 0 0 1 4.62 12c0-.756.13-1.492.36-2.184V6.833H1.162C.422 8.303 0 10.088 0 12c0 1.912.422 3.697 1.162 5.167l3.818-2.983Z"
      fill="#FBBC04"
    />
    <path
      d="M12 4.65c1.76 0 3.34.605 4.58 1.79L20.02 3C17.94 1.075 15.24 0 12 0 7.218 0 3.136 2.918 1.162 6.833l3.818 2.983C5.967 6.853 8.732 4.65 12 4.65Z"
      fill="#EA4335"
    />
  </svg>
);

const VerifiedBadge = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6" xmlns="http://www.w3.org/2000/svg" className="ml-1">
    <circle cx="12" cy="12" r="12" fill="#3b82f6" />
    <path d="M7 12.5L10.5 16L18 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type Review = {
  id: number;
  name: string;
  image: string;
  date: string;
  rating: number;
  text: string;
  hasReadMore?: boolean;
};

const reviews: Review[] = [
  {
    id: 1,
    name: "moaz tariq",
    image: "https://ui-avatars.com/api/?name=moaz+tariq&background=1e3a8a&color=fff",
    date: "21 hours ago",
    rating: 5,
    text: "Great service with a user-friendly platform. Vetsondoor makes it easier for pet owners to access veterinary support conveniently. A helpful initiative for pet care.",
  },
  {
    id: 2,
    name: "Moazzam Karim",
    image: "https://ui-avatars.com/api/?name=Moazzam+Karim&background=ea580c&color=fff",
    date: "a day ago",
    rating: 5,
    text: "Dr Ahmad is one of finest Doctors i have ecer encountered yet. My cat was not urinating but visiting litter often for few days. Later on it was diagnosed with urinary obstruction by Dr Ahmad He performed catheterization on spot and saved my cat's life",
  },
  {
    id: 3,
    name: "shamroz hayat",
    image: "https://ui-avatars.com/api/?name=shamroz+hayat&background=4b5563&color=fff",
    date: "a day ago",
    rating: 5,
    text: "Great experience with Vetsondoor Veterinary Services! The team was professional, caring, and very helpful. They treated my pet with kindness and answered all my questions. Highly recommended for anyone looking for trustworthy veterinary care at their door step.",
  },
  {
    id: 4,
    name: "Muhammad Usman",
    image: "https://ui-avatars.com/api/?name=Muhammad+Usman&background=db2777&color=fff",
    date: "2 days ago",
    rating: 5,
    text: "Amazing experience with Vets on Door! I had my cat vaccinated and dewormed, the service was very good and quick. The vet was very gentle and knowledgeable. It was great to receive such excellent service from them at home. 10/10 recommended.",
  },
  {
    id: 5,
    name: "Bilal Khan",
    image: "https://ui-avatars.com/api/?name=Bilal+Khan&background=059669&color=fff",
    date: "3 months ago",
    rating: 5,
    text: "Extremely satisfied with the vaccination service at home. Very convenient and Dr. Ahmad is clearly an expert.",
  },
];

export default function GoogleReviews() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // Use Math.ceil to handle sub-pixel rendering issues on high DPI screens
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkScroll, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const card = current.firstElementChild as HTMLElement;
      if (card) {
        const scrollAmount = card.offsetWidth + 24; // Card width + 24px gap (gap-6)
        
        if (direction === "left") {
          current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        } else {
          current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }
    }
  };

  return (
    <div className="w-full bg-[#f8fcfd] py-16 relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
          
          {/* Left Side: Summary Info */}
          <div className="w-full lg:w-[280px] flex-shrink-0 flex items-start gap-4 z-10">
            {/* Logo */}
            <div className="w-[60px] h-[60px] rounded-full flex-shrink-0 bg-white flex items-center justify-center shadow-sm border border-gray-100 overflow-hidden relative">
              <Image src="/logo.svg" alt="Vets On Door Logo" fill className="object-contain p-1" />
            </div>
            
            <div className="flex flex-col">
              <h2 className="font-bold text-gray-900 text-lg leading-snug mb-3">
                Vets On Door - Home<br/>Vet Service Lahore
              </h2>
              
              <div className="flex items-center gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#FBBC04" stroke="#FBBC04" />
                ))}
              </div>
              
              <p className="text-[#4b5563] text-sm mb-4">Google reviews</p>
              
              <a 
                href="https://maps.app.goo.gl/6YdctWARCk4ChEME6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 rounded-[4px] text-sm font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors w-max shadow-sm"
              >
                Write a review
              </a>
            </div>
          </div>

          {/* Right Side: Reviews Slider */}
          <div className="relative w-full flex-grow group">
            
            {/* Left Navigation Button */}
            {canScrollLeft && (
              <button 
                onClick={() => scroll("left")}
                className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-[40px] h-[40px] flex items-center justify-center bg-white text-gray-600 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-gray-100 hover:text-gray-900 transition-colors"
                aria-label="Previous reviews"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Scrollable Container */}
            <div 
              ref={scrollRef}
              onScroll={checkScroll}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 px-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {reviews.map((review) => (
                <div 
                  key={review.id} 
                  className="flex-shrink-0 w-full md:w-[calc((100%-24px)/2)] xl:w-[calc((100%-48px)/3)] bg-white rounded-[16px] p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 snap-start flex flex-col"
                >
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={review.image} 
                        alt={review.name} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <h4 className="font-bold text-gray-900 text-[15px]">{review.name}</h4>
                        <p className="text-[13px] text-gray-500">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <GoogleIcon />
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="#FBBC04" stroke="#FBBC04" />
                    ))}
                    <VerifiedBadge />
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 text-[15px] leading-relaxed flex-grow">
                    {review.text}
                  </p>
                  
                  {review.hasReadMore && (
                    <button className="text-gray-500 text-sm text-left mt-2 hover:text-gray-700 transition-colors">
                      Read more
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Right Navigation Button */}
            {canScrollRight && (
              <button 
                onClick={() => scroll("right")}
                className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-[40px] h-[40px] flex items-center justify-center bg-white text-gray-600 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] border border-gray-100 hover:text-gray-900 transition-colors"
                aria-label="Next reviews"
              >
                <ChevronRight size={24} />
              </button>
            )}
            
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        `
      }} />
    </div>
  );
}
