import React from 'react';
import Image from 'next/image';
import { PlatformConfig } from '../config/platformsConfig';

interface FollowSectionProps {
  platforms: PlatformConfig[];
  onPlatformClick: (platform: PlatformConfig) => void;
}

const FollowSection = ({ platforms, onPlatformClick }: FollowSectionProps) => {
  return (
    <section className="mb-8 sm:mb-12">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div 
          className="flex-shrink-0 w-1 h-8 rounded-full"
          style={{
            background: 'linear-gradient(to bottom, var(--accent-color), var(--primary-color))'
          }}
        ></div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Follow Us
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => onPlatformClick(platform)}
            className={`${platform.color} text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 sm:hover:scale-105 flex flex-col items-center justify-center gap-1.5 sm:gap-2 min-h-[80px] sm:min-h-[100px] touch-manipulation`}
          >
            {platform.isImage ? (
              <div className="bg-white rounded-full p-1.5 sm:p-2 flex items-center justify-center">
                <Image 
                  src={platform.icon} 
                  alt={platform.name}
                  width={48}
                  height={48}
                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                />
              </div>
            ) : (
              <span className="text-2xl sm:text-3xl">{platform.icon}</span>
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

export default FollowSection;

