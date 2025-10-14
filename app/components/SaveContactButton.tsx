import React from 'react';
import { UserPlus } from 'lucide-react';

interface SaveContactButtonProps {
  onClick: () => void;
}

const SaveContactButton = ({ onClick }: SaveContactButtonProps) => {
  return (
    <section className="mb-8 sm:mb-12">
      <button
        onClick={onClick}
        className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-98 sm:hover:scale-[1.02] flex items-center justify-between group touch-manipulation"
      >
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-full p-3 sm:p-4 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UserPlus size={32} className="text-purple-600" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg sm:text-xl mb-1">Save My Contact</h3>
            <p className="text-sm sm:text-base opacity-90">Add to your phone contacts</p>
          </div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-full p-2 sm:p-3 group-hover:bg-opacity-30 transition-all">
          <svg 
            className="w-5 h-5 sm:w-6 sm:h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 4v16m8-8H4" 
            />
          </svg>
        </div>
      </button>
    </section>
  );
};

export default SaveContactButton;

