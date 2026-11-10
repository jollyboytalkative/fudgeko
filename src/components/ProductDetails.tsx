import { Award, ExternalLink, Layers, Leaf, ShieldCheck } from 'lucide-react';
import { PACKAGING_IMAGE_URL, PRODUCT_INFO } from '../types';
import { trackEvent } from '../utils/analytics';
import { Carousel } from './Carousel';

export function ProductDetails() {
  return (
    <div className="space-y-4">
      <div
        className="bg-white rounded-3xl border border-caramel-100 shadow-sm overflow-hidden"
        id="fudge-details-card"
      >
        <div className="relative h-64 sm:h-80 md:h-96 w-full">
          <Carousel />
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          <div className="space-y-3">
            <h2 className="text-xs font-extrabold text-cocoa-600 tracking-widest uppercase font-mono">
              Our Story &amp; Craft
            </h2>
            <p className="text-cocoa-800 leading-relaxed text-base sm:text-lg">
              {PRODUCT_INFO.description}{' '}
              <span className="text-cocoa-700">
                Crafted in small batches in Parle Point, Surat, Gujarat for families and dessert
                lovers across the city.
              </span>
            </p>
          </div>

          <div className="bg-caramel-100/50 rounded-2xl p-5 border border-caramel-100 flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-32 h-24 rounded-xl overflow-hidden shadow-md flex-shrink-0 border-2 border-white">
              <img
                src={PACKAGING_IMAGE_URL}
                alt="Fudgeko 250g homemade chocolate fudge packed in hygienic aluminum foil tray in Surat, Gujarat"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-cocoa-800 font-bold">
                <Layers className="w-4 h-4 text-caramel-500" />
                <span>Modular 250 Grams Packs Only</span>
              </div>
              <p className="text-sm text-cocoa-700 leading-relaxed">
                We freshly bake and cool our chocolate fudge inside standard{' '}
                <strong>250g aluminum foil pans</strong>. If you order 1 kg, you will receive
                exactly <strong>4 packs</strong>. This keeps the fudge incredibly fresh, hygienic,
                and perfectly portioned!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-caramel-100 pb-2">
                <Leaf className="w-5 h-5 text-green-600" />
                <h3 className="font-display text-base font-bold text-cocoa-800">
                  Ingredients List
                </h3>
              </div>
              <ul className="space-y-2">
                {PRODUCT_INFO.ingredients.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-sm text-cocoa-800">
                    <div className="w-1.5 h-1.5 rounded-full bg-caramel-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-caramel-100 pb-2">
                <ShieldCheck className="w-5 h-5 text-caramel-500" />
                <h3 className="font-display text-base font-bold text-cocoa-800">
                  Quality Standards
                </h3>
              </div>
              <div className="space-y-3.5">
                <div className="flex gap-2.5">
                  <Award className="w-4.5 h-4.5 text-caramel-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-cocoa-800 uppercase tracking-wider">
                      Fresh-to-Order
                    </h4>
                    <p className="text-xs text-cocoa-600">
                      We do not stock fudge. It is made only after your order is confirmed.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-caramel-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-cocoa-800 uppercase tracking-wider">
                      Hygienic Home Kitchen
                    </h4>
                    <p className="text-xs text-cocoa-600">
                      Prepared individually with sanitized tools, filtered water, and top-grade
                      dairy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 w-full">
        <a
          href="https://share.google/fxxfK7aV05m2zjxlV"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('google_profile_click', { location: 'product_details' })}
          className="google-animated-btn cursor-pointer w-full"
          id="google-profile-btn"
        >
          <div className="google-animated-btn-inner">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#ffffff] shadow-sm shrink-0 select-none">
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                />
              </svg>
            </div>
            <span className="text-[#ffffff]">View Fudgeko Google Profile</span>
            <ExternalLink className="w-4 h-4 stroke-[#ffffff] ml-0.5" />
          </div>
        </a>
      </div>
    </div>
  );
}
