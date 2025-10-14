import React from 'react';

interface HeaderProps {
  companyName?: string;
}

const Header = ({ companyName }: HeaderProps) => {
  // Use default values if not provided
  const displayName = companyName || "KABi";
  const displaySubtitle = companyName && companyName !== "KABi" ? "" : "Kitchen and Bath Institute";
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="text-center">
          <div className="mb-4 sm:mb-5 flex flex-col items-center">
            <h1 
              className="text-4xl sm:text-6xl font-black bg-clip-text text-transparent tracking-tight leading-none mb-1.5"
              style={{
                backgroundImage: 'linear-gradient(to right, var(--accent-color), var(--primary-color), var(--secondary-color))'
              }}
            >
              {displayName}
            </h1>
            {displaySubtitle && (
              <p className="text-xs sm:text-sm font-semibold text-gray-600 tracking-wide uppercase">
                {displaySubtitle}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-gray-700">
            <a href="tel:6692981888" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <span className="text-lg">📞</span>
              <span className="text-sm sm:text-base font-medium">(669) 298-1888</span>
            </a>
            <span className="hidden sm:inline text-gray-300">|</span>
            <a 
              href="https://maps.google.com/?q=1754+Junction+Ave,+San+Jose" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-blue-600 transition-colors"
            >
              <span className="text-lg">📍</span>
              <span className="text-sm sm:text-base font-medium">1754 Junction Ave, San Jose</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

