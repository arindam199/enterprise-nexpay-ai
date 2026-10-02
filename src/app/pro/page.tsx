"use client";
import React, { useState } from 'react';

export default function ProCheckout() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000')"}}>
        <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl text-center shadow-2xl border border-white/20">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Payment Successful!</h2>
          <p className="text-white/80 font-medium">Welcome to NexPay PRO. Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-cover bg-center relative p-4" style={{backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000')"}}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
      
      <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl relative z-10 animate-fade-in-up">
        
        {/* Quick Payment Options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button className="bg-black hover:bg-gray-800 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-4 h-4" alt="GPay" /> Pay
          </button>
          <button className="bg-[#5f259f] hover:bg-[#4a1c7c] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition">
            PhonePe
          </button>
          <button className="bg-[#002970] hover:bg-[#001f54] text-white py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition">
            MobiKwik
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
            NetBanking
          </button>
        </div>

        <div className="flex items-center gap-4 my-6">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-gray-400 text-sm font-medium">OR</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <form onSubmit={handlePayment}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-gray-800 font-bold text-lg">Bank Card</h3>
            <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input type="text" placeholder="Card Number *" required className="w-full bg-gray-100 border-transparent focus:border-teal-500 focus:bg-white focus:ring-0 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 font-medium outline-none transition" />
            </div>
            
            <div className="relative">
              <input type="text" placeholder="Cardholder *" required className="w-full bg-gray-100 border-transparent focus:border-teal-500 focus:bg-white focus:ring-0 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 font-medium outline-none transition" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="MM/YY *" required className="w-full bg-gray-100 border-transparent focus:border-teal-500 focus:bg-white focus:ring-0 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 font-medium outline-none transition" />
              <input type="password" placeholder="CVV *" required maxLength={4} className="w-full bg-gray-100 border-transparent focus:border-teal-500 focus:bg-white focus:ring-0 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 font-medium outline-none transition" />
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3">
            <div className="flex items-center h-5">
              <input id="save-card" type="checkbox" className="w-4 h-4 text-teal-500 bg-gray-100 border-gray-300 rounded focus:ring-teal-500" />
            </div>
            <label htmlFor="save-card" className="text-xs text-gray-600 leading-relaxed">
              <span className="font-bold text-gray-800 block mb-0.5">Save card details for future use</span>
              By clicking checkbox and saving card details I agree with <a href="#" className="text-teal-600 hover:underline">COF Agreement</a>
            </label>
          </div>

          <button type="submit" disabled={loading} className="mt-8 w-full bg-[#00e5ff] hover:bg-[#00d0e8] text-gray-900 font-bold text-lg py-4 rounded-xl flex items-center justify-between px-6 transition disabled:opacity-70 disabled:cursor-not-allowed">
            <span>{loading ? 'Processing...' : 'Pay $99.00 USD'}</span>
            {!loading && (
              <div className="bg-teal-900/10 p-1.5 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </div>
            )}
          </button>
        </form>

        <button onClick={() => window.location.href = '/'} className="mt-6 w-full text-center text-sm font-bold text-gray-400 hover:text-gray-600 transition">
          Cancel and Return
        </button>
      </div>
    </div>
  );
}
