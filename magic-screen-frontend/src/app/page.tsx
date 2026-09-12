'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Sparkles, Star, MapPin, Clock, ChevronRight, Play, Zap } from 'lucide-react';
import { IMAGES } from '@/lib/images';

const OCCASIONS = [
  { emoji: '🎂', label: 'Birthday' },
  { emoji: '💝', label: 'Anniversary' },
  { emoji: '💍', label: 'Proposal' },
  { emoji: '🎀', label: 'Bride to Be' },
  { emoji: '👶', label: 'Baby Shower' },
  { emoji: '🌙', label: 'Date Night' },
  { emoji: '🎓', label: 'Farewell' },
  { emoji: '🥳', label: 'Reunion' },
  { emoji: '🎬', label: 'Movie Night' },
  { emoji: '💼', label: 'Corporate' },
];

const WHY_US = [
  { icon: <ShieldCheck size={22} />, title: 'Fully Private', desc: 'No strangers, no interruptions. The entire theater is exclusively yours.' },
  { icon: <Star size={22} />, title: 'Premium Setup', desc: 'Luxury recliner seats, 4K screen, Dolby Atmos sound, and customisable decor.' },
  { icon: <Clock size={22} />, title: 'Flexible Slots', desc: 'Morning to midnight slots, 1.5hr or 2.5hr sessions. Book any day.' },
  { icon: <MapPin size={22} />, title: 'Bhadurpally', desc: 'Conveniently located in Bhadurpally — easily accessible from across Hyderabad.' },
  { icon: <Sparkles size={22} />, title: 'Free Decorations', desc: 'Complimentary base decoration for all occasions. Upgrade available.' },
  { icon: <Zap size={22} />, title: 'Instant Confirmation', desc: 'WhatsApp confirmation immediately after booking. No waiting.' },
];

const STATS = [
  { value: '2000+', label: 'Happy Celebrations' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '4', label: 'Private Theaters' },
];

export default function Home() {
  return (
    <main style={{ background: '#0D0D0D', color: '#fff', overflowX: 'hidden' }}>

      {/* ── HERO ── */}
      <section style={{ minHeight: '95vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 16px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, background: 'radial-gradient(circle, rgba(212,160,23,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.25), transparent)' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.25)', borderRadius: 999, fontSize: 11, fontWeight: 700, color: '#D4A017', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 28 }}>
            <Star size={11} fill="#D4A017" color="#D4A017" /> Hyderabad&apos;s Premier Private Theater Experience
          </div>

          {/* Heading */}
          <h1 style={{ fontSize: 'clamp(42px, 7vw, 88px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 24, fontFamily: 'var(--font-display)' }}>
            Your Story Deserves a<br />
            <span style={{ color: '#D4A017' }}>Grand Stage</span>
          </h1>

          <p style={{ color: '#888', fontSize: 18, maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Private theater experiences for birthdays, anniversaries, proposals, and every moment worth celebrating.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            <Link href="/theaters" className="gold-btn">
              Book Your Experience <ChevronRight size={18} />
            </Link>
            <button onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })} className="ghost-btn">
              <Play size={15} fill="currentColor" /> View Gallery
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div style={{ position: 'relative', zIndex: 1, marginTop: 80, width: '100%', maxWidth: 640 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, overflow: 'hidden', background: 'rgba(255,255,255,0.01)' }}>
            {STATS.map(({ value, label }, i) => (
              <div key={label} style={{ textAlign: 'center', padding: '20px 12px', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#D4A017', letterSpacing: '-0.02em' }}>{value}</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 4, fontWeight: 500, letterSpacing: '0.05em' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to top, #0D0D0D, transparent)', pointerEvents: 'none' }} />
      </section>

      {/* ── WHY US ── */}
      <section id="about" style={{ padding: '100px 16px', background: '#0D0D0D' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="section-label">Why Choose Us</span>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 900, fontFamily: 'var(--font-display)', marginBottom: 12 }}>Why The Magic Screen?</h2>
            <p style={{ color: '#555', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>Everything you need for an unforgettable private screening experience.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {WHY_US.map(({ icon, title, desc }) => (
              <div key={title} className="dark-card" style={{ padding: 28 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4A017', marginBottom: 20 }}>
                  {icon}
                </div>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{title}</h3>
                <p style={{ color: '#555', fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OCCASIONS ── */}
      <section style={{ padding: '100px 16px', background: '#080808' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="section-label">Every Moment</span>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 900, fontFamily: 'var(--font-display)' }}>
              Every Celebration, <span style={{ color: '#D4A017' }}>Perfectly Framed</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            {OCCASIONS.map(({ emoji, label }) => (
              <Link key={label} href="/theaters" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '24px 12px', background: '#111', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,160,23,0.5)'; (e.currentTarget as HTMLElement).style.background = 'rgba(212,160,23,0.05)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.background = '#111'; }}
              >
                <span style={{ fontSize: 32 }}>{emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#777', letterSpacing: '0.03em' }}>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery" style={{ padding: '100px 16px', background: '#0D0D0D' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span className="section-label">Our Gallery</span>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 900, fontFamily: 'var(--font-display)' }}>
              Moments We&apos;ve <span style={{ color: '#D4A017' }}>Crafted</span>
            </h2>
            <p style={{ color: '#555', fontSize: 16, marginTop: 8 }}>Real celebrations from our private theaters.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {IMAGES.gallery.map((src, i) => (
              <div key={src} style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 16, overflow: 'hidden', background: '#111', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Image
                  src={src}
                  alt={`Magic Screen celebration ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: '100px 16px', background: '#060606', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(212,160,23,0.04), transparent, rgba(212,160,23,0.04))', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>
          <span className="section-label">Limited Slots Available</span>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, fontFamily: 'var(--font-display)', marginBottom: 16 }}>
            Ready to Create a <span style={{ color: '#D4A017' }}>Memory?</span>
          </h2>
          <p style={{ color: '#555', fontSize: 16, marginBottom: 40 }}>Slots fill up fast on weekends. Book yours now.</p>
          <Link href="/theaters" className="gold-btn" style={{ fontSize: 18, padding: '16px 48px' }}>
            Browse Theaters <ChevronRight size={22} />
          </Link>
        </div>
      </section>
    </main>
  );
}