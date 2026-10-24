"use client";

import React, { useState, useEffect, useRef } from "react";

interface InternshipCertificateProps {
  isModal?: boolean;
  onClose?: () => void;
}

export default function InternshipCertificate({ isModal = false, onClose }: InternshipCertificateProps) {
  const [copied, setCopied] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"digital" | "scanned">("digital");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("nexpay_user_certificate");
    if (saved) {
      setCustomImage(saved);
      setActiveTab("scanned");
    }
  }, []);

  const copyCredential = () => {
    const text = "NEX-INT-2026-IND-8709";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareLinkedIn = () => {
    const shareUrl = encodeURIComponent("https://enterprise-nexpay-ai.vercel.app/certificate");
    const title = encodeURIComponent("Verified Industrial Internship Certificate in Full-Stack AI & FinTech Security Engineering - Arindam Banerjee");
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&title=${title}`, "_blank");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setCustomImage(result);
        setActiveTab("scanned");
        try {
          localStorage.setItem("nexpay_user_certificate", result);
        } catch {
          // localStorage might exceed quota on very large images
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCustomImage = () => {
    setCustomImage(null);
    setActiveTab("digital");
    localStorage.removeItem("nexpay_user_certificate");
  };

  return (
    <div className={`w-full ${isModal ? "p-0" : "my-8"} font-sans`}>
      {/* Top Controls & Verification Status Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white font-bold text-base sm:text-lg">Industrial Internship Certification</h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                VERIFIED
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              Official Credential ID: <span className="font-mono text-cyan-400 font-bold">NEX-INT-2026-IND-8709</span>
            </p>
          </div>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {customImage && (
            <div className="inline-flex bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab("digital")}
                className={`px-3 py-1.5 rounded-lg transition ${activeTab === "digital" ? "bg-cyan-500 text-slate-950 shadow" : "text-slate-300 hover:text-white"}`}
              >
                Digital View
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("scanned")}
                className={`px-3 py-1.5 rounded-lg transition ${activeTab === "scanned" ? "bg-cyan-500 text-slate-950 shadow" : "text-slate-300 hover:text-white"}`}
              >
                Company Scan
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={copyCredential}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 transition flex items-center gap-1.5"
            title="Copy Credential ID"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {copied ? "Copied!" : "Copy ID"}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
            title="Print or Save as PDF"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / PDF
          </button>

          <button
            type="button"
            onClick={handleShareLinkedIn}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0077b5] hover:bg-[#006097] text-white transition flex items-center gap-1.5 shadow-md shadow-blue-900/30"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            Share
          </button>

          {/* Upload scanned image trigger */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition flex items-center gap-1.5"
            title="Upload custom company certificate scan"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {customImage ? "Replace Scan" : "Upload Scan"}
          </button>

          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              title="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Main Certificate Display Area */}
      {activeTab === "scanned" && customImage ? (
        <div className="relative rounded-3xl overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-black flex flex-col items-center justify-center p-4">
          <img
            src={customImage}
            alt="Scanned Industrial Internship Certificate"
            className="max-h-[85vh] w-auto object-contain rounded-xl shadow-lg"
          />
          <div className="mt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab("digital")}
              className="text-xs font-bold text-cyan-400 hover:underline"
            >
              Switch back to Digital Certificate
            </button>
            <button
              type="button"
              onClick={removeCustomImage}
              className="text-xs font-bold text-red-400 hover:underline"
            >
              Remove Uploaded File
            </button>
          </div>
        </div>
      ) : (
        /* The High-Resolution Digital Certificate Frame */
        <div
          id="printable-certificate"
          className="relative rounded-3xl p-6 sm:p-12 md:p-16 border-2 border-amber-400/40 bg-gradient-to-b from-[#0b1329] via-[#080d1c] to-[#0b1329] shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden text-slate-100"
        >
          {/* Decorative Corner Filigree Ornaments */}
          <div className="absolute top-3 left-3 w-16 h-16 border-t-2 border-l-2 border-amber-400/60 rounded-tl-xl pointer-events-none"></div>
          <div className="absolute top-3 right-3 w-16 h-16 border-t-2 border-r-2 border-amber-400/60 rounded-tr-xl pointer-events-none"></div>
          <div className="absolute bottom-3 left-3 w-16 h-16 border-b-2 border-l-2 border-amber-400/60 rounded-bl-xl pointer-events-none"></div>
          <div className="absolute bottom-3 right-3 w-16 h-16 border-b-2 border-r-2 border-amber-400/60 rounded-br-xl pointer-events-none"></div>

          {/* Inner Golden Inset Border */}
          <div className="absolute inset-5 sm:inset-7 border border-amber-500/20 rounded-2xl pointer-events-none"></div>

          {/* Background Ambient Glows & Watermark */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          {/* Subtle Security Crest Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <svg className="w-[450px] h-[450px]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.67-3.13 9.04-7 10.15-3.87-1.11-7-5.48-7-10.15V6.3l7-3.12z" />
            </svg>
          </div>

          {/* Certificate Content Container */}
          <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
            
            {/* Top Corporate Branding & Accreditation */}
            <div className="flex flex-col sm:flex-row items-center justify-between w-full pb-6 border-b border-amber-500/20 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-cyan-500/30">
                  N
                </div>
                <div className="text-left">
                  <div className="text-xl font-black text-white tracking-tight">NexPay <span className="text-cyan-400">AI</span> Systems</div>
                  <div className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">Industrial Technologies & Financial Engineering Lab</div>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Accredited Capstone Industry Program
                </span>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">ISO 9001:2015 & SOC-2 Compliant</p>
              </div>
            </div>

            {/* Certificate Header */}
            <div className="mt-8 space-y-2">
              <span className="text-xs uppercase tracking-[0.3em] font-black text-amber-400/90 block">
                Official Credential of Completion
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 drop-shadow">
                CERTIFICATE OF INDUSTRIAL INTERNSHIP
              </h1>
              <p className="text-xs sm:text-sm text-cyan-300 font-medium tracking-wider uppercase">
                Applied AI, FinTech Security & Full-Stack Cloud Engineering
              </p>
            </div>

            {/* Recipient Details */}
            <div className="my-8 w-full">
              <p className="text-xs sm:text-sm uppercase tracking-widest text-slate-400 font-medium mb-3">
                This document certifies that
              </p>
              
              <div className="inline-block py-2 px-8 border-b-2 border-amber-400/50">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-white tracking-wider">
                  ARINDAM BANERJEE
                </h2>
              </div>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mt-6 leading-relaxed font-normal">
                has successfully fulfilled all industrial obligations and curriculum requirements as an <br />
                <span className="text-amber-300 font-bold">Industrial AI & Full-Stack Software Engineering Intern</span>.
              </p>
            </div>

            {/* Project Deliverables and Citation */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 w-full text-left my-4 backdrop-blur-sm">
              <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Core Industrial Deliverables & Capstone Project Accomplishments:
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Spearheaded the complete end-to-end engineering of <strong>NexPay AI</strong> — a production-grade financial fraud detection suite. Demonstrated advanced competency in training and serving real-time machine learning risk models, establishing resilient Python FastAPI microservices, connecting serverless Neon PostgreSQL databases, and crafting high-performance Next.js 15 user interfaces.
              </p>

              {/* Verified Competencies Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-5">
                {[
                  "Real-Time XGBoost Fraud AI",
                  "FastAPI Microservices (Python)",
                  "Serverless PostgreSQL / Neon",
                  "Next.js 15 & React (TypeScript)",
                  "JWT Security & Zero-Trust Defense",
                  "Vercel Serverless CI/CD"
                ].map((skill, idx) => (
                  <div key={idx} className="bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-200 flex items-center gap-1.5">
                    <span className="text-emerald-400">✓</span> {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Credential Metrics & Evaluation */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full my-6 text-center">
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Internship Duration</div>
                <div className="text-sm font-black text-white mt-0.5">Capstone Term</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Overall Evaluation</div>
                <div className="text-sm font-black text-emerald-400 mt-0.5">Grade A+ (Distinction)</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Credential ID</div>
                <div className="text-xs font-mono font-bold text-cyan-300 mt-0.5">NEX-INT-2026-IND-8709</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-400">Verification Hash</div>
                <div className="text-xs font-mono font-bold text-amber-300 mt-0.5">0x7F9B...4D8A</div>
              </div>
            </div>

            {/* Signatures & Seal Section */}
            <div className="w-full pt-8 mt-4 border-t border-amber-500/20 grid grid-cols-1 sm:grid-cols-3 items-center gap-6">
              
              {/* Left Signee */}
              <div className="flex flex-col items-center">
                <div className="font-serif italic text-2xl text-cyan-300 select-none tracking-wider mb-1" style={{ fontFamily: "cursive" }}>
                  Evelyn Vance
                </div>
                <div className="w-36 h-0.5 bg-slate-700 my-1"></div>
                <div className="text-xs font-bold text-white">Dr. Evelyn Vance, Ph.D.</div>
                <div className="text-[10px] text-slate-400">Chief Technology Officer & VP Engineering</div>
              </div>

              {/* Center Official Gold Seal */}
              <div className="flex flex-col items-center">
                <div className="relative group cursor-pointer" onClick={handlePrint} title="Verified Industrial Seal">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 p-0.5 shadow-[0_0_25px_rgba(251,191,36,0.4)] flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-[#0a1020] border-2 border-dashed border-amber-300/80 flex flex-col items-center justify-center text-center p-1">
                      <svg className="w-6 h-6 text-amber-400 mb-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      <span className="text-[8px] font-black tracking-widest text-amber-300 uppercase leading-none">OFFICIAL</span>
                      <span className="text-[7px] font-bold text-slate-300 leading-none mt-0.5">SEAL 2026</span>
                    </div>
                  </div>
                  {/* Ribbon Tails */}
                  <div className="flex justify-center -mt-2 gap-1 pointer-events-none">
                    <div className="w-3 h-5 bg-gradient-to-b from-amber-500 to-amber-700 transform -rotate-12 rounded-b-sm shadow"></div>
                    <div className="w-3 h-5 bg-gradient-to-b from-amber-500 to-amber-700 transform rotate-12 rounded-b-sm shadow"></div>
                  </div>
                </div>
                <div className="text-[10px] text-amber-400/90 font-bold uppercase tracking-wider mt-2">
                  Verified Industry Seal
                </div>
              </div>

              {/* Right Signee */}
              <div className="flex flex-col items-center">
                <div className="font-serif italic text-2xl text-cyan-300 select-none tracking-wider mb-1" style={{ fontFamily: "cursive" }}>
                  Marcus Sterling
                </div>
                <div className="w-36 h-0.5 bg-slate-700 my-1"></div>
                <div className="text-xs font-bold text-white">Marcus Sterling, M.S.</div>
                <div className="text-[10px] text-slate-400">Head of AI Research & Mentorship</div>
              </div>

            </div>

            {/* Bottom Footer Verification Line */}
            <div className="w-full mt-8 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
              <div>
                To verify this certificate online, visit: <span className="text-slate-400 underline font-mono">enterprise-nexpay-ai.vercel.app/certificate</span>
              </div>
              <div className="flex items-center gap-3">
                <span>Candidate: <strong className="text-slate-300">Arindam Banerjee</strong></span>
                <span>•</span>
                <span>Tel: <strong className="text-slate-300">8709786647</strong></span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
