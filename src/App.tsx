import { useEffect, useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { ShoppingBag } from 'lucide-react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { LocalSeoFaq } from './components/LocalSeoFaq';
import { OrderingStepsCard } from './components/OrderingStepsCard';
import { OrderNowCard } from './components/OrderNowCard';
import { ProductDetails } from './components/ProductDetails';
import { ReviewsSliderCard } from './components/ReviewsSliderCard';
import { trackEvent } from './utils/analytics';

const GOOGLE_MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) || '';

export default function App() {
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  useEffect(() => {
    const canonicalUrl = `${window.location.origin}${window.location.pathname}`;
    const canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.href = canonicalUrl;
    }
    const ogUrlMeta = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
    if (ogUrlMeta) {
      ogUrlMeta.content = canonicalUrl;
    }
  }, []);

  const hasClientMapsProvider = GOOGLE_MAPS_API_KEY.trim().length > 0;

  const content = (
    <div className="min-h-screen flex flex-col bg-ivory text-cocoa-900 selection:bg-caramel-500 selection:text-white">
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-[#fef3c7] px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-[60] shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-[#fde68a] hover:text-[#ffffff]"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-extrabold text-caramel-500 uppercase tracking-widest font-mono">
              Freshly Sliced in Parle Point, Surat · Gujarat
            </span>
            <h1 className="font-display font-extrabold tracking-tight leading-tight">
              <span className="block text-2xl sm:text-4xl text-[#ffffff] mb-1">
                Homemade{' '}
              </span>
              <span className="block text-4xl sm:text-5xl">
                <span className="text-[#aa6a46]">Chocolate Fudge</span>{' '}
                <span className="text-[#ffffff]">in Surat</span>
              </span>
            </h1>
            <p className="text-base text-cocoa-600 leading-relaxed max-w-2xl mx-auto">
              Freshly prepared, velvety smooth, 100% eggless chocolate fudge sold exclusively in
              premium 250g foil packs across Surat, Gujarat. Call or WhatsApp to order and pick up
              fresh from our kitchen in Parle Point!
            </p>

            <div className="sm:hidden pt-2 flex justify-center">
              <button
                onClick={() => {
                  trackEvent('scroll_to_order_click', { location: 'hero_mobile' });
                  document.getElementById('order-form-card')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 bg-caramel-500 hover:bg-caramel-600 active:scale-95 text-white font-bold py-3.5 px-8 rounded-full shadow-lg border border-caramel-400/20 transition-all duration-300 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 text-white animate-bounce" />
                Order Your Fudge Now!
              </button>
            </div>

            <div className="pt-1">
              <span className="text-xs font-extrabold !text-black bg-amber-100/50 border border-amber-200/60 px-4 py-2 rounded-full inline-flex items-center gap-1.5 tracking-wide font-sans shadow-xs">
                📍 Exclusively in Surat, Gujarat — We don&apos;t deliver outside Surat for now
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <ProductDetails />
            <div className="space-y-6">
              <OrderingStepsCard />
              <OrderNowCard />
              <ReviewsSliderCard hasClientMapsProvider={hasClientMapsProvider} />
            </div>
          </div>

          <LocalSeoFaq />
        </div>
      </main>

      <Footer />
    </div>
  );

  if (!hasClientMapsProvider) {
    return content;
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} language="en" region="IN">
      {content}
    </APIProvider>
  );
}
