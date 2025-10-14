import React from 'react';
import Image from 'next/image';
import { PlatformConfig } from '../config/platformsConfig';

interface ReviewSectionProps {
  platforms: PlatformConfig[];
  onPlatformClick: (platform: PlatformConfig) => void;
}

const ReviewSection = ({ platforms, onPlatformClick }: ReviewSectionProps) => {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="flex-shrink-0 w-1 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Write a Good Review
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => onPlatformClick(platform)}
            className={`${platform.color} text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 sm:hover:scale-105 flex flex-col items-center justify-center gap-2 sm:gap-3 min-h-[100px] sm:min-h-[120px] touch-manipulation`}
          >
            {platform.isImage ? (
              <div className="bg-white rounded-full p-2 sm:p-3 flex items-center justify-center">
                <Image 
                  src={platform.icon} 
                  alt={platform.name}
                  width={64}
                  height={64}
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
              </div>
            ) : (
              <span className="text-3xl sm:text-4xl">{platform.icon}</span>
            )}
            <span className="font-medium text-xs sm:text-sm text-center leading-tight">
              {platform.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ReviewSection;

