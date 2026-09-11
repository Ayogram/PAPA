"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GiveModal from "./GiveModal";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [giveModalOpen, setGiveModalOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Global listener so links anywhere (e.g. in footer) can trigger the Give modal
  useEffect(() => {
    const handleOpenGive = () => setGiveModalOpen(true);
    window.addEventListener("open-give-modal", handleOpenGive);
    return () => window.removeEventListener("open-give-modal", handleOpenGive);
  }, []);

  const showSolidNav = !isHome || scrolled || mobileMenuOpen;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          showSolidNav
            ? "bg-[#0A0A0A] border-[#222] text-white shadow-xl"
            : "bg-transparent border-transparent text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Monogram */}
          <Link
            href="/"
            className="hover:opacity-80 transition-opacity shrink-0 flex items-center gap-3"
          >
            <span
              className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full font-extrabold text-sm sm:text-base tracking-tighter select-none bg-white text-[#0A0A0A] transition-colors"
            >
              N|A
            </span>
            <span className="font-extrabold text-sm sm:text-base tracking-tight hidden sm:inline-block">
              NIYI ANIYA
            </span>
          </Link>

          {/* Center Links (Desktop / Laptop / iPad Landscape) */}
          <div className="hidden md:flex gap-8 lg:gap-10 font-bold text-xs lg:text-[13px] tracking-widest uppercase">
            <Link
              href="/"
              className={`hover:text-[#E85D2A] transition-colors ${
                pathname === "/" ? "text-[#E85D2A]" : "text-white/90"
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`hover:text-[#E85D2A] transition-colors ${
                pathname === "/about" ? "text-[#E85D2A]" : "text-white/90"
              }`}
            >
              About
            </Link>
            <Link
              href="/the-word"
              className={`hover:text-[#E85D2A] transition-colors ${
                pathname.startsWith("/the-word") ? "text-[#E85D2A]" : "text-white/90"
              }`}
            >
              The Word
            </Link>
            <Link
              href="/photizo"
              className={`hover:text-[#E85D2A] transition-colors ${
                pathname === "/photizo" ? "text-[#E85D2A]" : "text-white/90"
              }`}
            >
              Photizo
            </Link>
          </div>

          {/* Right Action (Desktop / Laptop) */}
          <div className="hidden md:flex items-center gap-4">
            <button
              type="button"
              onClick={() => setGiveModalOpen(true)}
              className="bg-[#E85D2A] text-white hover:bg-[#cf4e1f] px-6 py-2.5 rounded-full font-bold text-xs lg:text-[13px] tracking-wider uppercase transition-colors cursor-pointer shadow-md"
            >
              Give
            </button>
          </div>

          {/* Mobile & iPad Hamburger Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              type="button"
              onClick={() => setGiveModalOpen(true)}
              className="bg-[#E85D2A] text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full"
            >
              Give
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0F0F0F] text-white border-b border-[#222] px-6 py-6 space-y-4 shadow-2xl animate-fadeIn">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block font-bold text-sm uppercase tracking-wider py-2.5 border-b border-[#1E1E1E] transition-colors ${
                pathname === "/" ? "text-[#E85D2A]" : "text-white/80 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`block font-bold text-sm uppercase tracking-wider py-2.5 border-b border-[#1E1E1E] transition-colors ${
                pathname === "/about" ? "text-[#E85D2A]" : "text-white/80 hover:text-white"
              }`}
            >
              About
            </Link>
            <Link
              href="/the-word"
              onClick={() => setMobileMenuOpen(false)}
              className={`block font-bold text-sm uppercase tracking-wider py-2.5 border-b border-[#1E1E1E] transition-colors ${
                pathname.startsWith("/the-word") ? "text-[#E85D2A]" : "text-white/80 hover:text-white"
              }`}
            >
              The Word
            </Link>
            <Link
              href="/photizo"
              onClick={() => setMobileMenuOpen(false)}
              className={`block font-bold text-sm uppercase tracking-wider py-2.5 border-b border-[#1E1E1E] transition-colors ${
                pathname === "/photizo" ? "text-[#E85D2A]" : "text-white/80 hover:text-white"
              }`}
            >
              Photizo
            </Link>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setGiveModalOpen(true);
                }}
                className="block w-full text-center bg-[#E85D2A] text-white py-3.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg"
              >
                Give / Partner
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Give Account Details Modal */}
      <GiveModal
        isOpen={giveModalOpen}
        onClose={() => setGiveModalOpen(false)}
      />
    </>
  );
}
