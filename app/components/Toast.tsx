import React from 'react';
import { Copy } from 'lucide-react';

interface ToastProps {
  show: boolean;
}

// WeChat ID Copied Toast
export const WeChatToast = ({ show }: ToastProps) => {
  if (!show) return null;
  
  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 animate-slideUp">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-white">
        <div className="bg-white rounded-full p-2">
          <Copy size={18} className="text-green-600" />
        </div>
        <div className="text-sm font-medium">
          <div className="font-bold">WeChat ID Copied!</div>
        </div>
      </div>
    </div>
  );
};

// Offline Warning Toast
export const OfflineToast = ({ show }: ToastProps) => {
  if (!show) return null;
  
  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slideUp">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-white">
        <div className="bg-white rounded-full p-2">
          <span className="text-lg">📡</span>
        </div>
        <div className="text-sm font-medium">
          <div className="font-bold">No Internet Connection</div>
          <div className="text-xs opacity-90">Some features may not work</div>
        </div>
      </div>
    </div>
  );
};

// Offline Mode Indicator
export const OfflineIndicator = ({ show }: ToastProps) => {
  if (!show) return null;
  
  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 px-4 py-2 bg-gray-800 text-white text-xs rounded-full shadow-lg opacity-75">
      Offline Mode
    </div>
  );
};

