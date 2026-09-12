'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Film, CheckCircle2, ArrowRight } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';
import { IMAGES } from '@/lib/images';
import apiClient from '@/lib/api';

const FALLBACK_THEATERS = [
  { id: '1', name: 'Blue',           screenSize: '120"', resolution: '4K', base_price: 799,  maxGuests: 4, coupleOnly: false, badge: null,         imageUrl: IMAGES.theaters.blue },
  { id: '2', name: 'Gold',           screenSize: '133"', resolution: '4K', base_price: 999,  maxGuests: 4, coupleOnly: false, badge: 'POPULAR',    imageUrl: IMAGES.theaters.gold },
  { id: '3', name: 'Red Love',       screenSize: '120"', resolution: '4K', base_price: 1199, maxGuests: 2, coupleOnly: true,  badge: 'COUPLE ONLY',imageUrl: IMAGES.theaters.redLove },
  { id: '4', name: 'Jail Dark Cell', screenSize: '133"', resolution: '4K', base_price: 1399, maxGuests: 4, coupleOnly: false, badge: null,         imageUrl: IMAGES.theaters.jailDarkCell },
];

function imageForTheater(name: string): string {
  const key = (name || '').toLowerCase();
  if (key.includes('gold')) return IMAGES.theaters.gold;
  if (key.includes('red') || key.includes('love')) return IMAGES.theaters.redLove;
  if (key.includes('jail') || key.includes('dark')) return IMAGES.theaters.jailDarkCell;
  return IMAGES.theaters.blue;
}

export default function TheatersPage() {
  const router = useRouter();
  const store = useBookingStore() as any;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: theaters } = useQuery({
    queryKey: ['theaters'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/api/theaters');
        if (!res.data || res.data.length === 0) return FALLBACK_THEATERS;
        return res.data.map((t: any) => ({
          id: String(t.id),
          name: t.name,
          screenSize: t.name?.toLowerCase().includes('gold') || t.name?.toLowerCase().includes('jail') ? '133"' : '120"',
          resolution: '4K',
          base_price: Number(t.base_price ?? 0),
          maxGuests: t.max_capacity ?? 4,
          coupleOnly: (t.max_capacity ?? 4) <= 2,
          badge: null,
          imageUrl: imageForTheater(t.name),
        }));
      } catch {
        return FALLBACK_THEATERS;
      }
    },
  });

  const THEATERS = theaters || FALLBACK_THEATERS;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const theater = THEATERS.find((t: any) => t.id === id);
    if (theater) store.setTheater({ theaterId: theater.id, theaterName: theater.name, basePrice: theater.base_price });
  };

  const handleContinue = () => {
    if (!selectedId) return;
    router.push(`/theater/${selectedId}/decoration`);
  };

  const selected = THEATERS.find(t => t.id === selectedId);

  return (
    <main style={{ minHeight: '100vh', background: '#0D0D0D', color: '#fff', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 16px 32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, fontFamily: 'var(--font-display)', marginBottom: 10 }}>
          Our Private Theaters
        </h1>
        <p style={{ color: '#888', fontSize: 16, marginBottom: 8 }}>Handcrafted private cinema experiences for every occasion.</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#D4A017', fontSize: 14 }}>
          <MapPin size={14} /> Bhadurpally, Hyderabad
        </div>
      </div>

      {/* Theater Cards Grid */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {THEATERS.map((theater) => {
            const isSelected = selectedId === theater.id;
            return (
              <button
                key={theater.id}
                type="button"
                onClick={() => handleSelect(theater.id)}
                style={{
                  position: 'relative',
                  textAlign: 'left',
                  borderRadius: 20,
                  border: isSelected ? '2px solid #D4A017' : '1px solid rgba(255,255,255,0.1)',
                  background: '#1A1A1A',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? '0 0 30px rgba(212,160,23,0.25)' : 'none',
                  outline: 'none',
                  width: '100%',
                }}
              >
                {/* Badge */}
                {theater.badge && (
                  <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, padding: '4px 10px', borderRadius: 8, background: '#D4A017', color: '#000', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>
                    {theater.badge}
                  </div>
                )}
                {isSelected && (
                  <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
                    <CheckCircle2 size={22} fill="#D4A017" color="#000" />
                  </div>
                )}

                {/* Image */}
                <div style={{ height: 200, position: 'relative', background: '#141414', overflow: 'hidden' }}>
                  {theater.imageUrl ? (
                    <Image src={theater.imageUrl} alt={theater.name} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Film size={40} color="#333" />
                    </div>
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />
                  {isSelected && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #D4A017, transparent)' }} />}
                </div>

                {/* Info */}
                <div style={{ padding: 20 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: isSelected ? '#D4A017' : '#fff', marginBottom: 4 }}>{theater.name}</h2>
                  <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>{theater.screenSize} · {theater.resolution}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 22, fontWeight: 900, color: '#D4A017', fontFamily: 'monospace' }}>₹{theater.base_price.toLocaleString('en-IN')}</span>
                    <span style={{ fontSize: 12, color: '#555' }}>for {theater.maxGuests} guest{theater.maxGuests > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue CTA */}
        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {selected && (
            <p style={{ color: '#888', fontSize: 14 }}>
              Selected: <strong style={{ color: '#fff' }}>{selected.name}</strong> — <strong style={{ color: '#D4A017' }}>₹{selected.base_price.toLocaleString('en-IN')}</strong>
            </p>
          )}
          <button
            type="button"
            disabled={!selectedId}
            onClick={handleContinue}
            className="gold-btn"
          >
            Continue to Book <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, zIndex: 50 }} className="md:hidden">
        <div>
          {selected ? (
            <>
              <p style={{ fontSize: 11, color: '#666' }}>Selected Theater</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{selected.name} <span style={{ color: '#D4A017' }}>₹{selected.base_price.toLocaleString('en-IN')}</span></p>
            </>
          ) : (
            <p style={{ fontSize: 13, color: '#666' }}>Select a theater to continue</p>
          )}
        </div>
        <button type="button" disabled={!selectedId} onClick={handleContinue} className="gold-btn" style={{ padding: '10px 20px', fontSize: 13 }}>
          Book Now <ArrowRight size={14} />
        </button>
      </div>
    </main>
  );
}