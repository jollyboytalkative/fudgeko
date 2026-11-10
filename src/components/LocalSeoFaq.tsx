import { useState } from 'react';
import { ChevronDown, HelpCircle, MapPin } from 'lucide-react';
import { PRODUCT_INFO } from '../types';
import { trackEvent } from '../utils/analytics';

interface FaqItem {
  question: string;
  answer: string;
}

const SURAT_FAQS: FaqItem[] = [
  {
    question: 'Where can I buy Fudgeko homemade chocolate fudge in Surat, Gujarat?',
    answer:
      'You can order fresh homemade chocolate fudge from Fudgeko by calling or WhatsApping +91 98259 05107 and picking up directly from 801, Amar Kruti Apts, Near Sargam Shopping Center, Parle Point, Surat - 395007, Gujarat.',
  },
  {
    question: 'Is Fudgeko chocolate fudge 100% eggless and pure vegetarian?',
    answer:
      'Yes. Every batch of Fudgeko chocolate fudge is 100% eggless and pure vegetarian, made in a hygienic home kitchen with premium dark chocolate, condensed milk, pure unsalted butter, and filtered water.',
  },
  {
    question: 'What is the price and pack size of Fudgeko chocolate fudge in Surat?',
    answer:
      'Fudgeko is packed in hygienic 250g aluminum foil trays priced at ₹300 per 250g pack. For larger orders such as 1 kg, you receive 4 freshly sealed 250g packs.',
  },
  {
    question: 'Do you deliver outside Surat or across Gujarat?',
    answer:
      'We currently serve Surat city only and do not ship outside Surat so every batch reaches you freshly set with zero preservatives. Pickup is convenient from Parle Point, Athwa Lines, Ghod Dod Road, City Light, Piplod, Vesu, and Adajan.',
  },
  {
    question: 'Can I pre-order fresh chocolate fudge batches for parties or festive gifting in Surat?',
    answer:
      'Yes. Because Fudgeko is never stocked and always made fresh to order, please call or WhatsApp +91 98259 05107 ahead for birthdays, house gatherings, or festive gifting in Surat.',
  },
];

const SURAT_LOCALITIES = [
  'Parle Point',
  'Athwa Lines',
  'Ghod Dod Road',
  'City Light',
  'Piplod',
  'Vesu',
  'Adajan',
  'Bhatar',
];

export function LocalSeoFaq() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleItem = (idx: number) => {
    const nextState = openIndex === idx ? -1 : idx;
    setOpenIndex(nextState);
    if (nextState !== -1) {
      trackEvent('faq_toggle', { question_index: idx + 1 });
    }
  };

  return (
    <section
      aria-labelledby="surat-faq-heading"
      className="bg-white rounded-3xl border border-caramel-100 shadow-sm p-6 sm:p-8 space-y-6"
      id="surat-pickup-faq"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-caramel-100 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-extrabold text-caramel-400 uppercase tracking-widest font-mono">
            <HelpCircle className="w-4 h-4 text-caramel-500" />
            <span>Surat, Gujarat Ordering Guide</span>
          </div>
          <h2
            id="surat-faq-heading"
            className="font-display text-2xl sm:text-3xl font-extrabold text-cocoa-800"
          >
            Homemade Chocolate Fudge in Surat — FAQs
          </h2>
        </div>

        <a
          href={PRODUCT_INFO.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('directions_click', { location: 'faq_header' })}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-caramel-400 hover:text-[#ffffff] hover:underline transition-colors shrink-0"
        >
          <MapPin className="w-3.5 h-3.5 text-caramel-500" />
          <span>Parle Point, Surat - 395007, Gujarat</span>
        </a>
      </div>

      <div className="space-y-3">
        {SURAT_FAQS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={item.question}
              className="bg-ivory rounded-2xl border border-caramel-400/25 overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleItem(idx)}
                aria-expanded={isOpen}
                className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-[#241510]/60 transition-colors"
              >
                <h3 className="text-sm sm:text-base font-bold text-[#ffffff] leading-snug">
                  {item.question}
                </h3>
                <ChevronDown
                  className={`w-4.5 h-4.5 text-caramel-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 pt-1 border-t border-caramel-400/15">
                  <p className="text-xs sm:text-sm text-[#dbd3cc] leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-2 border-t border-caramel-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#dbd3cc]">
        <p className="leading-relaxed">
          <span className="font-bold text-[#ffffff]">Quick Pickup Across Surat: </span>
          Easily reachable from {SURAT_LOCALITIES.join(', ')} (PIN 395007, Gujarat).
        </p>
      </div>
    </section>
  );
}
