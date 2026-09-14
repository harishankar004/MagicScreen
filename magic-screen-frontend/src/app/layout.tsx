import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'The Magic Screen — Private Theater Experience',
  description:
    "Book private theater experiences for birthdays, anniversaries, proposals and every moment worth celebrating. Hyderabad's premier private cinema.",
};

function SiteNavbar() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        {/* Logo */}
        <Link
          href="/"
          className="magic-logo-link"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <Image
            src="https://res.cloudinary.com/dadkhnpnf/image/upload/v1782474719/Logo_ixplnu.png"
            alt="The Magic Screen Logo"
            width={36}
            height={36}
            style={{
              borderRadius: '50%',
              objectFit: 'cover',
            }}
            priority
          />

          <span
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: '#D4A017',
              letterSpacing: '0.02em',
              fontFamily: 'var(--font-display)',
              whiteSpace: 'nowrap',
            }}
          >
            The Magic Screen
          </span>
        </Link>

        {/* Navigation */}
        <nav className="navbar-nav">
          {[
            { href: '/', label: 'Home' },
            { href: '/#about', label: 'About' },
            { href: '/#gallery', label: 'Gallery' },
            { href: '/tracking', label: 'Track Booking' },
          ].map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="navbar-link"
              style={{
                fontSize: 14,
                color: '#aaa',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.2s',
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Book Now */}
        <Link
          href="/theaters"
          className="book-now-link"
          style={{
            padding: '9px 18px',
            background: '#D4A017',
            color: '#000',
            fontSize: 13,
            fontWeight: 700,
            borderRadius: 12,
            textDecoration: 'none',
            transition: 'all 0.2s',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          Book Now
        </Link>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-grid">
        {/* Brand */}
        <div>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
            }}
          >
            <Image
              src="https://res.cloudinary.com/dadkhnpnf/image/upload/v1782474719/Logo_ixplnu.png"
              alt="The Magic Screen Logo"
              width={36}
              height={36}
              style={{
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />

            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#D4A017',
                fontFamily: 'var(--font-display)',
              }}
            >
              The Magic Screen
            </span>
          </Link>

          <p
            style={{
              fontSize: 13,
              color: 'rgba(212,160,23,0.55)',
              lineHeight: 1.6,
              maxWidth: 240,
            }}
          >
            Your private cinema experience. Celebrate every special moment in
            luxury, comfort, and cinematic style.
          </p>

          <div
            style={{
              display: 'flex',
              gap: 10,
            }}
          >
            {[
              {
                href: 'https://www.instagram.com/themagicscreen_/',
                label: 'IG',
              },
              {
                href: 'https://youtube.com/@themagicscreen',
                label: 'YT',
              },
              {
                href: 'https://facebook.com/themagicscreen',
                label: 'FB',
              },
            ].map(({ href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="social-link"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#111',
                  border: '1px solid rgba(212,160,23,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D4A017',
                  fontSize: 11,
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#D4A017',
              marginBottom: 20,
            }}
          >
            Navigation
          </h4>

          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {[
              { href: '/', label: 'Home' },
              { href: '/theaters', label: 'Book Now' },
              { href: '/#about', label: 'About Us' },
              { href: '/#gallery', label: 'Gallery' },
              { href: '/#addons', label: 'Add-ons' },
              { href: '/my-bookings/login', label: 'My Bookings' },
            ].map(({ href, label }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="footer-link"
                  style={{
                    fontSize: 13,
                    color: 'rgba(212,160,23,0.55)',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#D4A017',
              marginBottom: 20,
            }}
          >
            Contact Us
          </h4>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                fontSize: 13,
                color: 'rgba(212,160,23,0.55)',
              }}
            >
              <span>📍</span>
              <span>
                Doollapally main road, Bahadurpally, Hyderabad, Telangana
                500043
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span>📞</span>

              <a
                href="tel:+919505634984"
                className="footer-link"
                style={{
                  fontSize: 13,
                  color: 'rgba(212,160,23,0.55)',
                  textDecoration: 'none',
                }}
              >
                +91 9505634984
              </a>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span>✉️</span>

              <a
                href="mailto:themagicscreen18@gmail.com"
                className="footer-link"
                style={{
                  fontSize: 13,
                  color: 'rgba(212,160,23,0.55)',
                  textDecoration: 'none',
                  wordBreak: 'break-all',
                }}
              >
                themagicscreen18@gmail.com
              </a>
            </div>

            <a
              href="https://wa.me/919505634936?text=Hi%2C%20I%27d%20like%20to%20book%20a%20private%20theater"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn"
              style={{
                marginTop: 4,
                alignSelf: 'flex-start',
              }}
            >
              <span>💬</span> Chat on WhatsApp
            </a>
          </div>
        </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p
          style={{
            fontSize: 12,
            color: 'rgba(212,160,23,0.35)',
          }}
        >
          © 2026 The Magic Screen. All rights reserved.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 20,
          }}
        >
          {['Privacy Policy', 'Refund Policy', 'Terms & Conditions'].map(
            (label) => (
              <Link
                key={label}
                href="#"
                className="footer-bottom-link"
                style={{
                  fontSize: 12,
                  color: 'rgba(212,160,23,0.35)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
              >
                {label}
              </Link>
            )
          )}
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>
        <Providers>
          <SiteNavbar />

          <div className="site-content">
            {children}
          </div>

          <SiteFooter />
        </Providers>

        <script
          src="https://checkout.razorpay.com/v1/checkout.js"
          async
        />
      </body>
    </html>
  );
}