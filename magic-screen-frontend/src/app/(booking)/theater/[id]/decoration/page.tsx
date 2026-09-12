'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBookingStore } from '@/hooks/useBooking';
import BookingStepIndicator from '@/components/booking/BookingStepIndicator';
import { ArrowRight, ArrowLeft, CheckCircle2, Users, Star } from 'lucide-react';
import Image from 'next/image';
import { IMAGES } from '@/lib/images';

const BOOKING_STEPS = ['Decoration', 'Date & Slot', 'Occasion', 'Cake', 'Add-Ons', 'Food', 'Details', 'Summary'];

const DECORATIONS = [
  {
    id: 'golden-glow', name: 'Golden Glow', emoji: '✨',
    price: 999, decorationSetupPrice: 449, maxGuests: 4, extraPersonCharge: 199,
    coupleOnly: false, tag: 'POPULAR', tagBg: '#D4A017', tagColor: '#000',
    description: 'Golden metallic balloons, LED fairy lights, warm ambient glow setup with premium flower arrangement.',
    highlights: ['Golden metallic balloons', 'LED fairy lights', 'Flower arrangement', 'Welcome board'],
    imageUrl: IMAGES.decorations.goldenGlow,
  },
  {
    id: 'mystic-moments', name: 'Mystic Moments', emoji: '🌙',
    price: 1299, decorationSetupPrice: 449, maxGuests: 4, extraPersonCharge: 199,
    coupleOnly: false, tag: 'PREMIUM', tagBg: '#7C3AED', tagColor: '#fff',
    description: 'Mystical dark theme with purple and silver accents, star projections, and luxurious floral display.',
    highlights: ['Purple & silver accents', 'Star projections', 'Luxurious florals', 'Candle arrangement'],
    imageUrl: IMAGES.decorations.mysticMoments,
  },
  {
    id: 'velvet-vibes', name: 'Velvet Vibes', emoji: '❤️',
    price: 1499, decorationSetupPrice: 549, maxGuests: 2, extraPersonCharge: 0,
    coupleOnly: true, tag: 'COUPLE ONLY', tagBg: '#E11D48', tagColor: '#fff',
    description: 'Romantic velvet theme exclusively for couples — rose petals, heart balloons, and intimate candlelight setup.',
    highlights: ['Rose petal spread', 'Heart balloons', 'Candlelight setup', 'Couple welcome board'],
    imageUrl: IMAGES.decorations.velvetVibes,
  },
];

export default function DecorationPage() {
  const params = useParams();
  const router = useRouter();
  const theaterId = params.id as string;
  const store = useBookingStore() as any;

  const [selectedId, setSelectedId] = useState<string | null>(store.decorationId || null);
  const selectedDecoration = DECORATIONS.find(d => d.id === selectedId);
  const basePrice = store.basePrice || 0;
  const decorationPrice = selectedDecoration?.price ?? 0;
  const subtotal = basePrice + decorationPrice;

  const handleContinue = () => {
    if (!selectedId || !selectedDecoration) return;
    store.setDecoration({ decorationId: selectedDecoration.id, decorationName: selectedDecoration.name, decorationPrice: selectedDecoration.price, decorationExtraPersonCharge: selectedDecoration.extraPersonCharge });
    router.push(`/theater/${theaterId}/book`);
  };

  const handleSkip = () => {
    store.setDecoration({ decorationId: '', decorationName: '', decorationPrice: 0, decorationExtraPersonCharge: 0 });
    router.push(`/theater/${theaterId}/book`);
  };

  return (
    <main style={{ minHeight: '100vh', background: '#0D0D0D', color: '#fff', paddingBottom: 60 }}>
      <BookingStepIndicator steps={BOOKING_STEPS} currentStep={1} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px', display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(260px,1fr)', gap: 32, alignItems: 'start' }}>

        {/* Left */}
        <div>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 20, marginBottom: 28 }}>
            <h1 style={{ fontSize: 32, fontWeight: 900, fontFamily: 'var(--font-display)', marginBottom: 6 }}>Choose Your Decoration</h1>
            <p style={{ color: '#777', fontSize: 14 }}>Select a decoration package for <strong style={{ color: '#fff' }}>{store.theaterName}</strong>. You can also skip this step.</p>
          </div>

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {DECORATIONS.map((dec) => {
              const isSelected = selectedId === dec.id;
              return (
                <button
                  key={dec.id}
                  type="button"
                  onClick={() => setSelectedId(isSelected ? null : dec.id)}
                  style={{
                    position: 'relative', textAlign: 'left', borderRadius: 18, overflow: 'hidden', cursor: 'pointer', outline: 'none', width: '100%',
                    border: isSelected ? '2px solid #D4A017' : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: isSelected ? '0 0 25px rgba(212,160,23,0.2)' : 'none',
                    background: 'transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Badge */}
                  {dec.tag && (
                    <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, padding: '3px 10px', borderRadius: 20, background: dec.tagBg, color: dec.tagColor, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>
                      {dec.tag}
                    </div>
                  )}
                  {isSelected && (
                    <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
                      <CheckCircle2 size={20} fill="#D4A017" color="#000" />
                    </div>
                  )}

                  {/* Image */}
                  <div style={{ position: 'relative', width: '100%', height: 180, background: '#1A1A1A', overflow: 'hidden' }}>
                    {dec.imageUrl && !dec.imageUrl.includes('YOUR_CLOUD_NAME') ? (
                      <Image src={dec.imageUrl} alt={dec.name} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 48 }}>{dec.emoji}</span>
                        <p style={{ fontSize: 11, color: '#444', marginTop: 8 }}>No image yet</p>
                      </div>
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)' }} />
                    <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: isSelected ? '#D4A017' : '#fff' }}>{dec.name}</h3>
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ padding: 16, background: isSelected ? 'rgba(212,160,23,0.04)' : '#111', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ fontSize: 12, color: '#666', lineHeight: 1.5, marginBottom: 10 }}>{dec.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                      {dec.highlights.map(h => (
                        <span key={h} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 8px', background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, fontSize: 10, color: '#666' }}>
                          <Star size={7} color="#D4A017" fill="#D4A017" /> {h}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, fontSize: 11, color: '#555' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={11} /> For {dec.maxGuests} guests</span>
                      {dec.extraPersonCharge > 0 && <span style={{ color: '#D4A017' }}>+₹{dec.extraPersonCharge}/extra</span>}
                    </div>
                    <div style={{ borderTop: isSelected ? '1px solid rgba(212,160,23,0.2)' : '1px solid rgba(255,255,255,0.05)', paddingTop: 10, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 10, color: '#444' }}>Decoration Price</span>
                      <span style={{ fontSize: 22, fontWeight: 900, color: isSelected ? '#D4A017' : '#fff', fontFamily: 'monospace' }}>₹{dec.price.toLocaleString('en-IN')}</span>
                    </div>
                    <p style={{ fontSize: 9, color: '#333', marginTop: 2 }}>Setup charge: ₹{dec.decorationSetupPrice} (included)</p>
                  </div>
                </button>
              );
            })}
          </div>

          <button type="button" onClick={handleSkip} style={{ marginTop: 20, fontSize: 13, color: '#555', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Skip — continue without decoration
          </button>
        </div>

        {/* Right — Invoice Sidebar */}
        <div style={{ position: 'sticky', top: 24 }}>
          <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 14, marginBottom: 20 }}>Invoice Overview</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
                <span>Theater Base Price:</span>
                <span style={{ color: '#fff', fontFamily: 'monospace' }}>₹{basePrice}</span>
              </div>

              {selectedDecoration ? (
                <div style={{ background: '#0D0D0D', border: '1px solid rgba(212,160,23,0.12)', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#666' }}>Decoration:</span>
                    <span style={{ color: '#D4A017', fontWeight: 700 }}>{selectedDecoration.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                    <span style={{ color: '#444' }}>Price:</span>
                    <span style={{ color: '#fff', fontFamily: 'monospace' }}>₹{selectedDecoration.price}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                    <span style={{ color: '#444' }}>Setup:</span>
                    <span style={{ color: '#444' }}>Included</span>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#444', fontSize: 13 }}>
                  <span>Decoration:</span>
                  <span>Not selected</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#444', fontSize: 12, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
                <span>Date / Cake / Food:</span>
                <span>Next steps</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 14 }}>
                <span style={{ color: '#888', fontSize: 14 }}>Subtotal so far:</span>
                <span style={{ color: '#D4A017', fontSize: 22, fontWeight: 900, fontFamily: 'monospace' }}>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10, marginTop: 20 }}>
              <button type="button" onClick={() => router.push('/theaters')} style={{ padding: '14px', background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, color: '#666', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                <ArrowLeft size={18} />
              </button>
              <button type="button" disabled={!selectedId} onClick={handleContinue} className="gold-btn" style={{ padding: '14px 16px', fontSize: 14, justifyContent: 'center', borderRadius: 14 }}>
                Select Date & Slot <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}