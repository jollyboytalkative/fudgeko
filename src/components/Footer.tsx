import { Heart, MapPin, Phone } from 'lucide-react';
import { PRODUCT_INFO } from '../types';
import { trackEvent } from '../utils/analytics';

export function Footer() {
  const whatsappUrl = `https://wa.me/91${PRODUCT_INFO.contactNumber}?text=${encodeURIComponent(
    'Hi Fudgeko! 🍫 I would like to order fresh homemade chocolate fudge.',
  )}`;

  return (
    <footer className="bg-cocoa-900 text-white/90 border-t-4 border-caramel-500 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <img
              src="/fudgko/fudgeko-logo.png"
              alt="Fudgeko – Homemade Chocolate Fudge in Surat, Gujarat"
              loading="lazy"
              decoding="async"
              className="h-[64px] sm:h-[75px] w-auto object-contain"
            />
            <p className="text-xs text-caramel-100/75 leading-relaxed max-w-xs">
              Freshly prepared homemade chocolate fudge from our kitchen in Parle Point, Surat,
              Gujarat. Made to order with premium cocoa, unsalted butter, and care. 100% vegetarian
              and eggless.
            </p>
            <div className="flex items-center gap-2 text-xs text-green-400 font-bold">
              <div className="w-4.5 h-4.5 border-2 border-green-400 flex items-center justify-center rounded p-0.5">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full" />
              </div>
              <span>100% Vegetarian &amp; Eggless</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-widest text-caramel-400">
              Pickup Residence
            </h3>
            <div className="space-y-3">
              <div className="flex gap-2.5 text-xs text-caramel-100/80">
                <MapPin className="w-4 h-4 text-caramel-400 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">{PRODUCT_INFO.pickupAddress}</p>
              </div>
              <div className="flex gap-2.5 text-xs text-caramel-100/80">
                <Phone className="w-4 h-4 text-caramel-400 flex-shrink-0 mt-0.5" />
                <span>Call/WhatsApp: {PRODUCT_INFO.displayPhone}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-widest text-caramel-400">
              Direct Order
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={`tel:+91${PRODUCT_INFO.contactNumber}`}
                  onClick={() => trackEvent('contact_click', { method: 'phone', location: 'footer' })}
                  className="hover:text-caramel-400 transition-colors duration-300 cursor-pointer"
                >
                  Call {PRODUCT_INFO.displayPhone}
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent('contact_click', { method: 'whatsapp', location: 'footer' })
                  }
                  className="hover:text-caramel-400 transition-colors duration-300 cursor-pointer"
                >
                  Order on WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={PRODUCT_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('directions_click', { location: 'footer' })}
                  className="hover:text-caramel-400 transition-colors duration-300 cursor-pointer"
                >
                  View Pickup Location on Maps
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cocoa-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-caramel-100/60 font-medium">
          <p>
            © {new Date().getFullYear()} Fudgeko Surat, Gujarat. Homemade happiness in small
            batches.
          </p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in Surat, Gujarat
          </p>
        </div>
      </div>
    </footer>
  );
}
