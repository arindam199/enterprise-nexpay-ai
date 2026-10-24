"use client";

import React from "react";
import InternshipCertificate from "../components/InternshipCertificate";

export default function CertificatePage() {
  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 font-sans relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Top Navigation */}
      <nav className="bg-[#11192e]/80 backdrop-blur-md px-6 sm:px-12 py-4 flex flex-wrap justify-between items-center border-b border-slate-800 sticky top-0 z-30 shadow-2xl gap-4">
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 px-3.5 py-2 rounded-xl transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to NexPay App
          </a>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-cyan-500/30">
              N
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              NexPay <span className="text-cyan-400">Credential Portal</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="mailto:banerjeearindam888@gmail.com"
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-xl text-xs transition flex flex-col items-end text-right"
          >
            <span className="font-black text-cyan-400 tracking-wider">CONTACT ARINDAM</span>
            <span className="text-[10px] font-medium opacity-80">8709786647 | banerjeearindam888@gmail.com</span>
          </a>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 relative z-10">
        
        {/* Certificate Component */}
        <InternshipCertificate />

        {/* Detailed Credential Assessment & Recruiter Overview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-[#11192e] border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 font-black">
              📊
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Technical Evaluation</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Evaluated across core industrial software development metrics:
            </p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-300">AI Risk Scoring Architecture</span>
                  <span className="text-cyan-400">98%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: "98%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-300">FastAPI & Python Microservices</span>
                  <span className="text-cyan-400">99%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: "99%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-300">Serverless Neon PostgreSQL</span>
                  <span className="text-cyan-400">96%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: "96%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-300">Next.js 15 & UI Performance</span>
                  <span className="text-cyan-400">97%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: "97%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#11192e] border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 font-black">
              💼
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Industrial Scope</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Key milestones achieved during this enterprise capstone deployment:
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✔</span>
                <span>Implemented real-time velocity checking and geolocation anomaly heuristics.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✔</span>
                <span>Configured zero-trust JWT authentication with seamless token persistence.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✔</span>
                <span>Engineered pure Python DB connector to bypass serverless C-extension compilation bottlenecks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✔</span>
                <span>Integrated modern checkout system supporting UPI, GPay, and Card rails.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#11192e] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 font-black">
                👤
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Candidate Details</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Available for Full-Time and High-Impact Software Engineering Roles:
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Name</span>
                  <span className="text-white font-bold text-sm">Arindam Banerjee</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Email</span>
                  <a href="mailto:banerjeearindam888@gmail.com" className="text-cyan-400 font-semibold hover:underline">
                    banerjeearindam888@gmail.com
                  </a>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone</span>
                  <span className="text-white font-semibold">8709786647</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">GitHub Repository</span>
                  <a href="https://github.com/arindam199/enterprise-nexpay-ai" target="_blank" rel="noopener noreferrer" className="text-cyan-400 font-semibold hover:underline">
                    github.com/arindam199/enterprise-nexpay-ai
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <a
                href="mailto:banerjeearindam888@gmail.com?subject=Interview%20Invitation%20-%20Arindam%20Banerjee"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-xl text-center block text-xs transition shadow-lg shadow-cyan-500/20"
              >
                Schedule an Interview with Arindam
              </a>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
