import { useCallback, useEffect, useRef, useState } from 'react';
import { APILoadingStatus, useApiLoadingStatus, useMapsLibrary } from '@vis.gl/react-google-maps';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, ExternalLink, MessageSquareQuote, Star } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export interface CustomerReview {
  authorName: string;
  authorUri: string | null;
  authorPhotoUri: string | null;
  rating: number;
  text: string;
  relativeTime: string;
  reviewUri: string | null;
}

export interface ReviewsData {
  placeName: string;
  rating: number | null;
  userRatingCount: number;
  googleMapsUri: string | null;
  reviewsUri: string | null;
  writeAReviewUri: string | null;
  reviews: CustomerReview[];
}

interface ReviewsSliderCardProps {
  hasClientMapsProvider: boolean;
}

const FUDGEKO_GOOGLE_PROFILE_FALLBACK = 'https://share.google/fxxfK7aV05m2zjxlV';
const PLACE_TEXT_QUERY = 'Fudgeko 801 Amar Kruti Apts Parle Point Surat';

function isQuotaErrorMessage(err: unknown): boolean {
  const msg =
    err instanceof Error ? err.message : typeof err === 'string' ? err : JSON.stringify(err ?? '');
  return (
    msg.includes('OVER_QUERY_LIMIT') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('QuotaExceededError') ||
    msg.includes('OverQuotaMapError') ||
    msg.includes('429')
  );
}

function triggerQuotaNotice() {
  window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
}

function renderStars(score: number) {
  const rounded = Math.round(score);
  return (
    <div className="flex items-center gap-0.5" aria-label={`${score} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((starIndex) => (
        <Star
          key={starIndex}
          className={`w-3.5 h-3.5 ${
            starIndex <= rounded
              ? 'fill-[#fbbc05] stroke-[#fbbc05]'
              : 'fill-transparent stroke-[#aa6a4666]'
          }`}
        />
      ))}
    </div>
  );
}

function ReviewerAvatar({
  photoUri,
  name,
}: {
  photoUri: string | null;
  name: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const initial = (name.trim()[0] || 'G').toUpperCase();

  if (!photoUri || imgFailed) {
    return (
      <div className="w-9 h-9 rounded-full bg-[#3d251a] border border-caramel-400/40 flex items-center justify-center text-xs font-extrabold text-[#ffffff] shrink-0 select-none">
        {initial}
      </div>
    );
  }

  return (
    <img
      src={photoUri}
      alt={name}
      referrerPolicy="no-referrer"
      onError={() => setImgFailed(true)}
      className="w-9 h-9 rounded-full object-cover border border-caramel-400/40 shrink-0 bg-[#241510]"
    />
  );
}

function GoogleBadgeIcon() {
  return (
    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#ffffff] shadow-xs shrink-0 select-none">
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
  );
}

function ReviewsSliderContent({
  data,
  isLoading,
  error,
}: {
  data: ReviewsData | null;
  isLoading: boolean;
  error: string | null;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const reviews = data?.reviews ?? [];
  const totalSlides = reviews.length;

  useEffect(() => {
    setActiveIndex(0);
  }, [totalSlides]);

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setActiveIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, totalSlides]);

  const activeReview = reviews[activeIndex];
  const allReviewsHref =
    data?.reviewsUri || data?.googleMapsUri || FUDGEKO_GOOGLE_PROFILE_FALLBACK;
  const writeReviewHref = data?.writeAReviewUri;

  return (
    <div
      className="bg-white rounded-3xl border border-caramel-100 shadow-sm p-5 sm:p-6 space-y-4"
      id="google-reviews-card"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Compact Header */}
      <div className="flex items-center justify-between gap-3 border-b border-caramel-100 pb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <GoogleBadgeIcon />
          <div className="min-w-0">
            <h2 className="font-display text-xl font-extrabold text-[#ffffff] leading-tight truncate">
              Google Reviews
            </h2>
            <p className="text-[11px] font-medium text-[#dbd3cc] tracking-wide">
              Customer reviews from Google
            </p>
          </div>
        </div>

        {data?.rating != null && (
          <div className="flex items-center gap-2 bg-ivory border border-caramel-400/30 rounded-2xl px-3 py-1.5 shrink-0">
            <span className="font-display text-base font-extrabold text-[#ffffff] tabular-nums">
              {data.rating.toFixed(1)}
            </span>
            <Star className="w-3.5 h-3.5 fill-[#fbbc05] stroke-[#fbbc05]" />
            {data.userRatingCount > 0 && (
              <span className="text-[11px] text-[#dbd3cc] font-medium tabular-nums">
                ({data.userRatingCount})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Body States */}
      {isLoading ? (
        <div className="bg-ivory rounded-2xl p-4 sm:p-5 border border-caramel-400/20 space-y-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#3d251a]" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3.5 w-32 rounded bg-[#3d251a]" />
              <div className="h-2.5 w-20 rounded bg-[#2a1810]" />
            </div>
          </div>
          <div className="space-y-2 pt-1">
            <div className="h-3 w-full rounded bg-[#2a1810]" />
            <div className="h-3 w-5/6 rounded bg-[#2a1810]" />
          </div>
        </div>
      ) : error ? (
        <div className="bg-ivory rounded-2xl p-4 sm:p-5 border border-caramel-400/25 text-center space-y-3">
          <p className="text-xs sm:text-sm text-[#dbd3cc] leading-relaxed">{error}</p>
          <a
            href={FUDGEKO_GOOGLE_PROFILE_FALLBACK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('google_reviews_link_click', { action: 'fallback_profile' })}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-caramel-400 hover:underline"
          >
            <span>Read reviews on Fudgeko&apos;s Google Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      ) : activeReview ? (
        <>
          <div className="bg-ivory rounded-2xl p-4 sm:p-5 border border-caramel-400/25 min-h-[146px] flex flex-col justify-between overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeReview.authorName}-${activeIndex}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="space-y-3"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ReviewerAvatar
                      photoUri={activeReview.authorPhotoUri}
                      name={activeReview.authorName}
                    />
                    <div className="min-w-0">
                      {activeReview.authorUri ? (
                        <a
                          href={activeReview.authorUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            trackEvent('google_reviews_link_click', { action: 'author_profile' })
                          }
                          className="text-xs sm:text-sm font-bold text-[#ffffff] hover:text-caramel-400 transition-colors truncate block"
                        >
                          {activeReview.authorName}
                        </a>
                      ) : (
                        <span className="text-xs sm:text-sm font-bold text-[#ffffff] truncate block">
                          {activeReview.authorName}
                        </span>
                      )}
                      {activeReview.relativeTime && (
                        <span className="text-[11px] text-[#dbd3cc]/80 block">
                          {activeReview.relativeTime}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-0.5 shrink-0">{renderStars(activeReview.rating)}</div>
                </div>

                <div className="flex items-start gap-2">
                  <MessageSquareQuote className="w-4 h-4 text-caramel-400 shrink-0 mt-0.5 opacity-80" />
                  <p className="text-xs sm:text-sm text-[#f7f3f0] leading-relaxed">
                    {activeReview.text
                      ? `“${activeReview.text}”`
                      : `Rated ${activeReview.rating} out of 5 stars on Google.`}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider Controls + Google Attribution Links */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
            <div className="flex items-center gap-2">
              {totalSlides > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      trackEvent('review_slide_change', { direction: 'prev' });
                      prevSlide();
                    }}
                    className="w-7 h-7 rounded-full bg-ivory border border-caramel-400/30 hover:border-caramel-400 text-[#f7f3f0] hover:text-[#ffffff] flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Previous review"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1.5 px-1">
                    {reviews.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === activeIndex
                            ? 'w-5 bg-[#c58963]'
                            : 'w-1.5 bg-[#aa6a4659] hover:bg-caramel-400'
                        }`}
                        aria-label={`View review ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      trackEvent('review_slide_change', { direction: 'next' });
                      nextSlide();
                    }}
                    className="w-7 h-7 rounded-full bg-ivory border border-caramel-400/30 hover:border-caramel-400 text-[#f7f3f0] hover:text-[#ffffff] flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Next review"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 text-[11px] font-semibold">
              {writeReviewHref && (
                <a
                  href={writeReviewHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent('google_reviews_link_click', { action: 'write_review' })
                  }
                  className="text-[#dbd3cc] hover:text-caramel-400 transition-colors"
                >
                  Write a review
                </a>
              )}
              <a
                href={allReviewsHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('google_reviews_link_click', { action: 'view_all' })}
                className="inline-flex items-center gap-1 text-caramel-400 hover:underline"
              >
                <span>See all on Google</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-ivory rounded-2xl p-4 border border-caramel-400/25 text-center space-y-2">
          <p className="text-xs sm:text-sm text-[#dbd3cc]">
            No customer reviews returned yet. Check Fudgeko directly on Google Maps!
          </p>
          <a
            href={allReviewsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-caramel-400 hover:underline"
          >
            <span>Open on Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}

function ReviewsSliderWithSdk() {
  const placesLib = useMapsLibrary('places');
  const apiStatus = useApiLoadingStatus();
  const [data, setData] = useState<ReviewsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  const fetchViaServerFallback = useCallback(async () => {
    try {
      const res = await fetch('/api/reviews');
      const json = (await res.json()) as ReviewsData & { error?: string; status?: string };
      if (res.status === 429 || json.status === 'RESOURCE_EXHAUSTED') {
        triggerQuotaNotice();
        throw new Error(json.error || 'Quota limit reached');
      }
      if (!res.ok) {
        throw new Error(json.error || 'Unable to load Google reviews right now.');
      }
      setData(json);
      setError(null);
    } catch (err) {
      if (isQuotaErrorMessage(err)) {
        triggerQuotaNotice();
      }
      setError('Unable to load Google reviews right now.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (fetchedRef.current) return;

    if (apiStatus === APILoadingStatus.AUTH_FAILURE) {
      fetchedRef.current = true;
      triggerQuotaNotice();
      setError('Unable to load Google reviews right now.');
      setIsLoading(false);
      return;
    }

    if (apiStatus === APILoadingStatus.FAILED) {
      fetchedRef.current = true;
      void fetchViaServerFallback();
      return;
    }

    if (!placesLib) return;
    fetchedRef.current = true;

    let cancelled = false;

    const loadPlacesReviews = async () => {
      try {
        const { places } = await placesLib.Place.searchByText({
          textQuery: PLACE_TEXT_QUERY,
          fields: [
            'displayName',
            'rating',
            'userRatingCount',
            'reviews',
            'googleMapsURI',
            'googleMapsLinks',
          ],
          locationBias: { lat: 21.1745, lng: 72.7935 },
          language: 'en',
          region: 'IN',
          maxResultCount: 1,
          internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio'],
        });

        if (cancelled) return;

        const place = places?.[0];
        if (!place) {
          setData({
            placeName: 'Fudgeko',
            rating: null,
            userRatingCount: 0,
            googleMapsUri: null,
            reviewsUri: null,
            writeAReviewUri: null,
            reviews: [],
          });
          setIsLoading(false);
          return;
        }

        const mappedReviews: CustomerReview[] = (place.reviews ?? []).map((review) => ({
          authorName: review.authorAttribution?.displayName || 'Google User',
          authorUri: review.authorAttribution?.uri || null,
          authorPhotoUri: review.authorAttribution?.photoURI || null,
          rating: typeof review.rating === 'number' ? review.rating : 5,
          text: review.text || review.originalText || '',
          relativeTime: review.relativePublishTimeDescription || '',
          reviewUri: review.googleMapsURI || null,
        }));

        setData({
          placeName: place.displayName || 'Fudgeko',
          rating: typeof place.rating === 'number' ? place.rating : null,
          userRatingCount: typeof place.userRatingCount === 'number' ? place.userRatingCount : 0,
          googleMapsUri: place.googleMapsURI || null,
          reviewsUri: place.googleMapsLinks?.reviewsURI || place.googleMapsURI || null,
          writeAReviewUri: place.googleMapsLinks?.writeAReviewURI || null,
          reviews: mappedReviews,
        });
        setIsLoading(false);
      } catch (err) {
        if (cancelled) return;
        if (isQuotaErrorMessage(err)) {
          triggerQuotaNotice();
          setError('Unable to load Google reviews right now.');
          setIsLoading(false);
          return;
        }
        await fetchViaServerFallback();
      }
    };

    void loadPlacesReviews();

    return () => {
      cancelled = true;
    };
  }, [placesLib, apiStatus, fetchViaServerFallback]);

  return <ReviewsSliderContent data={data} isLoading={isLoading} error={error} />;
}

function ReviewsSliderServerOnly() {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch('/api/reviews');
        const json = (await res.json()) as ReviewsData & { error?: string; status?: string };
        if (cancelled) return;

        if (res.status === 429 || json.status === 'RESOURCE_EXHAUSTED') {
          triggerQuotaNotice();
          setError('Unable to load Google reviews right now.');
          setIsLoading(false);
          return;
        }

        if (!res.ok) {
          setError('Unable to load Google reviews right now.');
          setIsLoading(false);
          return;
        }

        setData(json);
        setIsLoading(false);
      } catch (err) {
        if (cancelled) return;
        if (isQuotaErrorMessage(err)) {
          triggerQuotaNotice();
        }
        setError('Unable to load Google reviews right now.');
        setIsLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return <ReviewsSliderContent data={data} isLoading={isLoading} error={error} />;
}

export function ReviewsSliderCard({ hasClientMapsProvider }: ReviewsSliderCardProps) {
  return hasClientMapsProvider ? <ReviewsSliderWithSdk /> : <ReviewsSliderServerOnly />;
}
