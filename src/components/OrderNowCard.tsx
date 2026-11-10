import { MessageCircle, Phone, ShoppingBag } from 'lucide-react';
import { PRODUCT_INFO } from '../types';
import { trackEvent } from '../utils/analytics';

export function OrderNowCard() {
  const whatsappText = encodeURIComponent(
    'Hi Fudgeko! 🍫 I would like to order fresh homemade chocolate fudge.',
  );
  const whatsappUrl = `https://wa.me/91${PRODUCT_INFO.contactNumber}?text=${whatsappText}`;

  return (
    <div
      className="bg-white rounded-3xl border border-caramel-100 shadow-sm p-6 sm:p-8 space-y-6"
      id="order-form-card"
    >
      <div className="border-b border-caramel-100 pb-5">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-cocoa-800 flex items-center gap-2.5">
          <ShoppingBag className="w-6 h-6 text-caramel-500" />
          Order Now
        </h2>
      </div>

      <div className="bg-ivory rounded-2xl p-6 sm:p-8 border border-caramel-400/30 text-center space-y-3">
        <a
          href={`tel:+91${PRODUCT_INFO.contactNumber}`}
          onClick={() =>
            trackEvent('contact_click', { method: 'phone', location: 'order_now_number' })
          }
          className="font-display text-3xl sm:text-4xl font-extrabold text-[#ffffff] tracking-tight hover:text-caramel-400 transition-colors duration-200 inline-block"
        >
          {PRODUCT_INFO.displayPhone}
        </a>
        <p className="text-sm sm:text-base text-cocoa-600 leading-relaxed max-w-sm mx-auto">
          Call or WhatsApp on this number to Order Now.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href={`tel:+91${PRODUCT_INFO.contactNumber}`}
          onClick={() =>
            trackEvent('contact_click', { method: 'phone', location: 'order_now_button' })
          }
          className="w-full bg-caramel-500 font-extrabold text-sm py-3.5 px-5 rounded-2xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          id="order-call-btn"
        >
          <Phone className="w-4.5 h-4.5" />
          <span>Call Now</span>
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent('contact_click', { method: 'whatsapp', location: 'order_now_button' })
          }
          className="w-full bg-green-600 hover:bg-green-700 text-[#ffffff] font-extrabold text-sm py-3.5 px-5 rounded-2xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          id="order-whatsapp-btn"
        >
          <MessageCircle className="w-4.5 h-4.5 stroke-[#ffffff]" />
          <span>WhatsApp to Order</span>
        </a>
      </div>

      <div className="pt-5 border-t border-caramel-100 flex items-center justify-between gap-4">
        <span className="text-base sm:text-lg font-bold text-cocoa-600">
          Price per 250g pack
        </span>
        <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#ffffff] tabular-nums">
          ₹{PRODUCT_INFO.pricePerPack}
        </span>
      </div>
    </div>
  );
}
