import { Phone } from 'lucide-react';
import { PRODUCT_INFO } from '../types';
import { trackEvent } from '../utils/analytics';

export function Header() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-caramel-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
            id="nav-home-btn"
          >
            <img
              src="/fudgko/fudgeko-logo.png"
              alt="Fudgeko – Homemade Chocolate Fudge in Surat, Gujarat"
              className="h-16 sm:h-[74px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </button>

          <a
            href={`tel:+91${PRODUCT_INFO.contactNumber}`}
            onClick={() => trackEvent('contact_click', { method: 'phone', location: 'header' })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-caramel-500 text-white shadow-sm transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0"
            id="nav-call-btn"
          >
            <Phone className="w-4 h-4" />
            <span>{PRODUCT_INFO.displayPhone}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
