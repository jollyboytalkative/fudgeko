import { ListChecks, MapPin } from 'lucide-react';
import { PRODUCT_INFO } from '../types';
import { trackEvent } from '../utils/analytics';

export function OrderingStepsCard() {
  return (
    <div
      className="bg-white rounded-3xl border border-caramel-100 shadow-sm p-6 sm:p-8 space-y-5"
      id="ordering-steps-card"
    >
      <div className="border-b border-caramel-100 pb-4 flex items-center gap-2.5">
        <ListChecks className="w-6 h-6 text-caramel-500" />
        <h2 className="font-display text-2xl font-extrabold text-cocoa-800">
          Steps for Ordering
        </h2>
      </div>

      <ol className="space-y-3.5 text-sm text-cocoa-600 leading-relaxed">
        <li className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-caramel-100 text-caramel-400 font-mono text-xs font-bold flex items-center justify-center mt-0.5">
            1
          </span>
          <span>Call us or WhatsApp us to place your order.</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-caramel-100 text-caramel-400 font-mono text-xs font-bold flex items-center justify-center mt-0.5">
            2
          </span>
          <span>
            Once your fresh fudge is ready, we will let you know through a call or WhatsApp.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-caramel-100 text-caramel-400 font-mono text-xs font-bold flex items-center justify-center mt-0.5">
            3
          </span>
          <span>Pick up your order from the address below:</span>
        </li>
      </ol>

      <div className="bg-ivory rounded-2xl p-4 border border-caramel-400/30">
        <a
          href={PRODUCT_INFO.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('directions_click', { location: 'ordering_steps' })}
          className="flex items-start gap-2.5 text-xs sm:text-sm text-cocoa-700 hover:text-caramel-400 transition-colors leading-relaxed font-medium"
        >
          <MapPin className="w-4.5 h-4.5 text-caramel-500 flex-shrink-0 mt-0.5" />
          <span>{PRODUCT_INFO.pickupAddress}</span>
        </a>
      </div>
    </div>
  );
}
