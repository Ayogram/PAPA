"use client";

import { useState, useEffect } from "react";

interface GiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
}

export default function GiveModal({
  isOpen,
  onClose,
  accountNumber = "0007397915",
  accountName = "ANIYA OLANIYI",
  bankName = "GTBank (Guaranty Trust Bank)",
}: GiveModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#141414] border border-[#262626] rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#222] hover:bg-[#333] text-[#A1A1A1] hover:text-white flex items-center justify-center transition-colors text-sm"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#E85D2A]/10 text-[#E85D2A] flex items-center justify-center mx-auto mb-4 font-extrabold text-lg">
            ₦
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight">Partner &amp; Give</h3>
          <p className="text-xs sm:text-sm text-[#A1A1A1] mt-2 max-w-sm mx-auto leading-relaxed">
            Support the vision, outreach, and apostolic assignments of Apostle Niyi Aniya.
          </p>
        </div>

        {/* Account Details Box */}
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-5 sm:p-6 space-y-4 mb-6">
          <div className="flex justify-between items-center text-xs pb-3 border-b border-[#1C1C1C]">
            <span className="text-[#777] uppercase font-bold tracking-wider">Bank Name</span>
            <span className="font-bold text-white text-sm">{bankName}</span>
          </div>

          <div className="flex justify-between items-center text-xs pb-3 border-b border-[#1C1C1C]">
            <span className="text-[#777] uppercase font-bold tracking-wider">Account Name</span>
            <span className="font-bold text-white text-sm">{accountName}</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-[#777] uppercase font-bold tracking-wider">
                Account Number
              </span>
              <span className="text-[11px] text-[#E85D2A] font-bold">Direct Transfer</span>
            </div>
            <div className="flex items-center justify-between gap-3 bg-[#161616] border border-[#2A2A2A] rounded-xl p-3.5">
              <span className="font-mono text-xl sm:text-2xl font-extrabold tracking-wider text-white select-all">
                {accountNumber}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="bg-white hover:bg-[#E85D2A] text-[#0A0A0A] hover:text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
              >
                {copied ? "✓ Copied!" : "Copy Number"}
              </button>
            </div>
          </div>
        </div>

        {/* Instruction Footer */}
        <div className="text-center text-[11px] text-[#666] leading-relaxed">
          <p>
            Please add your full name or &ldquo;Seed / Offering&rdquo; as payment reference.
          </p>
          <p className="mt-1">God bless you abundantly for your kingdom partnership!</p>
        </div>
      </div>
    </div>
  );
}
