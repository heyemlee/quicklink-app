import React, { useRef } from 'react';
import Image from 'next/image';
import { Copy, RefreshCw, ExternalLink, X, Sparkles } from 'lucide-react';

const ReviewModal = ({
  isOpen,
  onClose,
  selectedPlatform,
  reviewText,
  isLoading,
  copySuccess,
  isPublishing,
  onRefresh,
  onCopy,
  onPublish,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}) => {
  const modalRef = useRef(null);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:w-full sm:max-w-lg h-[75vh] sm:h-auto sm:max-h-[70vh] overflow-hidden flex flex-col animate-slideUp"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Swipe indicator */}
        <div className="flex justify-center pt-2 pb-1 sm:hidden">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Modal Header */}
        <div
          className={`${selectedPlatform?.color} text-white p-4 sm:p-6 flex items-center justify-between flex-shrink-0`}
        >
          <div className="flex items-center gap-3">
            {selectedPlatform?.isImage ? (
              <div className="bg-white rounded-full p-2 flex items-center justify-center">
                <Image 
                  src={selectedPlatform?.icon} 
                  alt={selectedPlatform?.name}
                  width={48}
                  height={48}
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
              </div>
            ) : (
              <span className="text-2xl sm:text-3xl">
                {selectedPlatform?.icon}
              </span>
            )}
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                Write a Review
              </h3>
              <p className="text-xs sm:text-sm opacity-90">
                {selectedPlatform?.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Generated Review Text */}
          <div className="relative">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Sparkles size={16} className="text-purple-600" />
              AI Generated Review
            </label>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 sm:p-5 border-2 border-gray-200 min-h-[100px] sm:min-h-[120px] relative overflow-hidden">
              {isLoading ? (
                <div className="space-y-3">
                  {/* Skeleton loader */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-500 border-t-transparent"></div>
                    <span className="text-sm text-gray-600 animate-pulse">Generating your review...</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded animate-pulse w-full"></div>
                    <div className="h-3 bg-gray-300 rounded animate-pulse w-11/12"></div>
                    <div className="h-3 bg-gray-300 rounded animate-pulse w-4/5"></div>
                  </div>
                </div>
              ) : (
                <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                  {reviewText}
                </p>
              )}
            </div>
            {copySuccess && (
              <div className="absolute -top-2 right-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs py-1.5 px-4 rounded-full animate-bounce shadow-lg flex items-center gap-1">
                <Copy size={12} />
                Copied!
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex-1 bg-gray-200 text-gray-700 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-sm sm:text-base font-medium hover:bg-gray-300 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <RefreshCw
                size={16}
                className={`sm:w-[18px] sm:h-[18px] ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Regenerate</span>
              <span className="sm:hidden">Refresh</span>
            </button>
            <button
              onClick={onCopy}
              disabled={isLoading}
              className="flex-1 bg-blue-500 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-sm sm:text-base font-medium hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <Copy size={16} className="sm:w-[18px] sm:h-[18px]" />
              {copySuccess ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Publish Button */}
          <button
            onClick={onPublish}
            disabled={isLoading || isPublishing}
            className={`w-full ${selectedPlatform?.color} text-white py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-base sm:text-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl`}
          >
            {isPublishing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Opening...
              </>
            ) : (
              <>
                <ExternalLink size={18} className="sm:w-5 sm:h-5" />
                Go to Publish
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;

