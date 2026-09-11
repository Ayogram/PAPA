"use client";

import Link from "next/link";

export default function Footer() {
  const openGiveModal = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-give-modal"));
    }
  };

  return (
    <footer className="bg-[#E5E7EB] text-[#111827] pt-16 sm:pt-20 pb-12 text-sm border-t border-[#D1D5DB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Grid: Brand Left, Columns Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#CBD5E1]">
          {/* Brand & Socials Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* Logo: NIYI ANIYA with N|A Monogram */}
            <div className="inline-block">
            <div className="flex items-start gap-2">
                <span className="font-extrabold text-3xl sm:text-4xl tracking-tighter text-[#E85D2A] leading-none uppercase select-none">
                  NIYI<br />ANIYA
                </span>
              </div>
              <span className="block text-[10px] font-extrabold tracking-[0.25em] uppercase text-[#0A0A0A] mt-1.5">
                MINISTRIES
              </span>
            </div>

            {/* Social Media: Only Facebook */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/pastorniyianiya1"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook Profile"
                className="inline-flex items-center gap-2.5 bg-[#0A0A0A] hover:bg-[#E85D2A] text-white px-4 py-2 rounded-full transition-colors text-xs font-bold uppercase tracking-wider"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Follow on Facebook</span>
              </a>
            </div>

            {/* Visit Ministry Link */}
            <div>
              <a
                href="https://waterbrooks.org"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111827] hover:text-[#E85D2A] transition-colors"
              >
                <span>Visit Waterbrooks Ministry International</span>
                <span className="text-sm">↗</span>
              </a>
            </div>
          </div>

          {/* Navigation Columns (Store removed) */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-2 gap-8">
            {/* Column 1: NAVIGATION */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-xs tracking-widest uppercase text-[#0A0A0A]">
                EXPLORE
              </h4>
              <ul className="space-y-2.5 text-xs text-[#4B5563] font-medium">
                <li>
                  <Link href="/" className="hover:text-[#0A0A0A] transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#0A0A0A] transition-colors">
                    About Apostle Niyi
                  </Link>
                </li>
                <li>
                  <Link href="/the-word" className="hover:text-[#0A0A0A] transition-colors">
                    The Word (Messages)
                  </Link>
                </li>
                <li>
                  <Link href="/photizo" className="hover:text-[#0A0A0A] transition-colors">
                    Photizo Broadcasts
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: CONTACT & IMPACT */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-extrabold text-xs tracking-widest uppercase text-[#0A0A0A]">
                  CONTACT
                </h4>
                <ul className="space-y-2.5 text-xs text-[#4B5563] font-medium">
                  <li>
                    <a href="mailto:olaniyianiya1@gmail.com" className="hover:text-[#0A0A0A] transition-colors">
                      olaniyianiya1@gmail.com
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-extrabold text-xs tracking-widest uppercase text-[#0A0A0A]">
                  GIVING &amp; PARTNERSHIP
                </h4>
                <ul className="space-y-2.5 text-xs">
                  <li>
                    <button
                      type="button"
                      onClick={openGiveModal}
                      className="hover:text-[#cf4e1f] font-bold text-[#E85D2A] transition-colors cursor-pointer inline-flex items-center gap-1.5 uppercase tracking-wider"
                    >
                      <span>Donate / Partner</span>
                      <span>→</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
      </div>
    </footer>
  );
}
