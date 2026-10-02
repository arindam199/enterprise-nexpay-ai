"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const API_URL = "/api/v1";

export default function Home() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLogin, setIsLogin] = useState(true);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const [txAmount, setTxAmount] = useState("");
  const [txReceiver, setTxReceiver] = useState("");
  const [txType, setTxType] = useState("transfer");
  const [txLocation, setTxLocation] = useState("local");
  
  const [alert, setAlert] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      fetchTransactions(savedToken);
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const formData = new FormData();
        formData.append("username", email);
        formData.append("password", password);
        
        const res = await axios.post(`${API_URL}/auth/login`, formData);
        setToken(res.data.access_token);
        localStorage.setItem("token", res.data.access_token);
        fetchTransactions(res.data.access_token);
      } else {
        await axios.post(`${API_URL}/auth/register`, { name, email, password });
        window.alert("Account verified! You can now log in securely.");
        setIsLogin(true);
      }
    } catch (err: any) {
      window.alert(err.response?.data?.detail || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (authToken: string) => {
    try {
      const res = await axios.get(`${API_URL}/transactions`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
      logout();
    }
  };

  const submitTx = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/transactions`, 
        { 
          receiver_account: txReceiver,
          amount: parseFloat(txAmount), 
          transaction_type: txType, 
          location: txLocation 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.is_fraud) {
        setAlert("⚠️ SECURITY ALERT: Transfer blocked by NexPay AI. Abnormal pattern detected.");
      } else {
        setAlert("✅ Sent successfully!");
      }
      setTimeout(() => setAlert(null), 5000);
      setTxAmount("");
      setTxReceiver("");
      fetchTransactions(token);
    } catch (err) {
      window.alert("Failed to submit transaction");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken("");
    setTransactions([]);
    localStorage.removeItem("token");
  };

  const chartData = transactions.slice(0, 10).reverse().map((t, i) => ({
    name: `T${i+1}`,
    amount: t.amount,
  }));

  if (!token) {
    return (
      <div 
        className="min-h-screen flex flex-col font-sans relative overflow-hidden"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

        <nav className="flex justify-between items-center px-10 py-6 fixed w-full z-20 top-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-cyan-500/30">N</div>
            <span className="text-2xl font-bold text-white tracking-tight">NexPay <span className="text-cyan-400">AI</span></span>
          </div>
          <div className="hidden md:flex gap-10 text-sm font-bold text-gray-200">
            <a href="#" className="hover:text-cyan-400 transition">Personal</a>
            <a href="#" className="hover:text-cyan-400 transition">Business</a>
            <a href="#" className="hover:text-cyan-400 transition">Developers</a>
          </div>
          <a href="mailto:banerjeearindam888@gmail.com" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-xl text-sm transition flex flex-col items-end text-right"><span className="font-black text-cyan-400 tracking-wider">CONTACT ME</span><span className="text-[10px] font-medium mt-0.5 opacity-80">8709786647 | banerjeearindam888@gmail.com</span></a>
        </nav>

        <main className="flex-1 mt-24 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto px-6 lg:px-12 py-12 gap-16 relative z-10 w-full">
          
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-block px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-sm backdrop-blur-md uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              Next-Gen Financial Security
            </div>
            <h1 className="text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight drop-shadow-2xl">
              Send Money. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                AI Will Protect It.
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-xl leading-relaxed mx-auto lg:mx-0 font-medium">
              Experience the world's first payments platform secured by real-time XGBoost AI models. We analyze 50+ data points instantly to block fraud before it happens.
            </p>
            
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
              <div className="flex -space-x-4">
                <img className="w-12 h-12 rounded-full border-2 border-slate-900" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User" />
                <img className="w-12 h-12 rounded-full border-2 border-slate-900" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="User" />
                <img className="w-12 h-12 rounded-full border-2 border-slate-900" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="User" />
              </div>
              <p className="text-sm text-gray-400 font-medium">
                Trusted by <span className="text-white font-bold">2M+</span> users
              </p>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
              
              <h3 className="text-3xl font-bold text-white mb-8 relative z-10">{isLogin ? "Access Dashboard" : "Create NexPay ID"}</h3>
              <form onSubmit={handleAuth} className="space-y-5 relative z-10">
                {!isLogin && (
                  <div>
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider ml-1">Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 px-5 py-3.5 bg-black/30 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition" required />
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider ml-1">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 px-5 py-3.5 bg-black/30 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition" required />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider ml-1">Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full mt-1 px-5 py-3.5 bg-black/30 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition" required />
                </div>
                
                <button type="submit" disabled={loading} className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-cyan-500/25 text-lg flex justify-center items-center">
                  {loading ? (
                    <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    isLogin ? "Secure Login" : "Join the Future"
                  )}
                </button>
              </form>
              <p className="text-center mt-8 text-gray-300 font-medium cursor-pointer hover:text-white transition relative z-10" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Don't have an account? Sign up" : "Already registered? Sign in"}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-800 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <nav className="bg-[#1e293b]/80 backdrop-blur-md px-8 py-4 flex justify-between items-center border-b border-gray-800 sticky top-0 z-20 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-[0_0_15px_rgba(34,211,238,0.4)]">N</div>
          <span className="text-2xl font-bold text-white tracking-tight">NexPay</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 text-sm font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-4 py-2 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.1)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            AI Engine Active
          </div>
          <button onClick={logout} className="text-gray-400 hover:text-white font-bold transition px-4 py-2 rounded-lg hover:bg-white/10">Logout</button>
        </div>
      </nav>

      {alert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#1e293b] border border-gray-700 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] transform transition-all text-center">
            {alert.includes("Fraud") ? (
              <>
                <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-20"></div>
                  <span className="text-5xl">🛡️</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Transfer Blocked</h2>
                <p className="text-gray-400 mb-8 leading-relaxed text-lg">
                  Our XGBoost AI engine analyzed the velocity and parameters of this transaction and determined a high risk of fraud.
                </p>
                <button onClick={() => setAlert(null)} className="w-full bg-white hover:bg-gray-200 text-black font-bold py-4 px-6 rounded-xl transition text-lg">
                  Secure My Account
                </button>
              </>
            ) : (
              <>
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-5xl">💸</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Money Sent!</h2>
                <p className="text-gray-400 mb-8 leading-relaxed text-lg">
                  Your funds were successfully processed and transferred securely.
                </p>
                <button onClick={() => setAlert(null)} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl transition text-lg shadow-lg shadow-cyan-500/25">
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl p-6 border border-gray-700 relative overflow-hidden group hover:scale-[1.02] transition-transform">
            <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="flex justify-between items-start mb-10 relative z-10">
              <span className="text-gray-400 font-medium uppercase tracking-widest text-xs">Wallet Balance</span>
              <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight relative z-10">
              $ { (10000 - transactions.filter(t=>!t.is_fraud).reduce((sum, t) => sum + t.amount, 0)).toLocaleString(undefined, {minimumFractionDigits: 2}) }
            </h2>
            <div className="mt-8 flex justify-between items-end relative z-10">
              <div className="text-gray-400 text-sm font-medium">**** **** **** 4289</div>
              <div className="text-gray-400 text-sm font-bold uppercase">VISA</div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-1 bg-[#1e293b] rounded-3xl shadow-xl p-6 border border-gray-800 flex flex-col justify-between hover:border-cyan-500/30 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-gray-400 font-medium uppercase tracking-widest text-xs">AI Sentinel</span>
              <div className="w-8 h-8 bg-cyan-500/10 rounded-full flex items-center justify-center">
                <span className="w-3 h-3 bg-cyan-400 rounded-full animate-ping absolute"></span>
                <span className="w-3 h-3 bg-cyan-500 rounded-full"></span>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-white">Active</h3>
              <p className="text-gray-500 text-sm mt-2">Monitoring transactions for anomalous velocity and location patterns in real-time.</p>
            </div>
          </div>

          <div className="col-span-1 md:col-span-1 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl shadow-xl p-6 border border-purple-700/50 relative overflow-hidden flex flex-col justify-center">
            <img src="https://images.unsplash.com/photo-1614064641913-a520faff3c25?auto=format&fit=crop&w=500&q=80" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
            <div className="relative z-10 text-center">
              <h3 className="text-2xl font-black text-white mb-2">Upgrade to PRO</h3>
              <p className="text-purple-200 text-sm mb-4">Get 0% international transfer fees.</p>
              <button onClick={() => window.location.href = '/pro'} className="bg-white text-purple-900 font-bold py-2 px-6 rounded-full shadow-lg hover:scale-105 transition-transform">Explore Perks</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1e293b] rounded-3xl shadow-xl border border-gray-800 p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
              
              <h2 className="text-2xl font-bold mb-8 text-white flex items-center">
                <div className="bg-blue-500/20 text-blue-400 p-3 rounded-xl mr-4 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                </div> 
                Send Money
              </h2>
              
              <form onSubmit={submitTx} className="space-y-6">
                
                <div className="relative">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Receiver (UPI / Bank)</label>
                  <input type="text" placeholder="e.g. rohit@upi or 45839201" value={txReceiver} onChange={e => setTxReceiver(e.target.value)} className="w-full px-5 py-4 bg-[#0f172a] border border-gray-700 rounded-2xl text-white font-medium focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition shadow-inner" required />
                </div>

                <div className="relative">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500 font-black text-2xl">$</span>
                    <input type="number" placeholder="0.00" value={txAmount} onChange={e => setTxAmount(e.target.value)} className="w-full pl-12 pr-5 py-4 bg-[#0f172a] border border-gray-700 rounded-2xl text-white font-black text-3xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition shadow-inner" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Method</label>
                    <select value={txType} onChange={e => setTxType(e.target.value)} className="w-full px-4 py-3 bg-[#0f172a] border border-gray-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-cyan-500 outline-none transition cursor-pointer appearance-none">
                      <option value="transfer">UPI Transfer</option>
                      <option value="payment">Merchant Pay</option>
                      <option value="withdrawal">ATM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</label>
                    <select value={txLocation} onChange={e => setTxLocation(e.target.value)} className="w-full px-4 py-3 bg-[#0f172a] border border-gray-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-cyan-500 outline-none transition cursor-pointer appearance-none">
                      <option value="local">Domestic</option>
                      <option value="international">Global</option>
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-lg py-5 rounded-2xl transition shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] mt-4 flex justify-center items-center gap-3 transform hover:-translate-y-1">
                  {loading ? (
                    <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    <>Send Securely <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg></>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-[#1e293b] rounded-3xl shadow-xl border border-gray-800 p-8 h-80 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
              <h2 className="text-xl font-bold mb-6 text-white relative z-10">Spending Velocity Analytics</h2>
              <div className="flex-1 min-h-0 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                    <XAxis dataKey="name" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} tickFormatter={val => `$${val}`} />
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'}} />
                    <Line type="monotone" dataKey="amount" stroke="#22d3ee" strokeWidth={4} dot={{r: 5, fill: '#0f172a', strokeWidth: 2, stroke: '#22d3ee'}} activeDot={{r: 8, fill: '#22d3ee'}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#1e293b] rounded-3xl shadow-xl border border-gray-800 p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
                <button onClick={() => fetchTransactions(token)} className="text-sm font-bold text-cyan-400 bg-cyan-900/30 border border-cyan-800/50 px-4 py-2 rounded-full hover:bg-cyan-900/50 transition flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  Sync
                </button>
              </div>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {transactions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-700 rounded-2xl">
                    <div className="text-5xl mb-4 opacity-50">📭</div>
                    <p className="font-medium">No recent activity.</p>
                  </div>
                ) : (
                  transactions.map((tx: any) => (
                    <div key={tx.id} className="flex items-center justify-between p-5 rounded-2xl bg-[#0f172a] hover:bg-slate-800 border border-gray-800 hover:border-gray-600 transition-all duration-300 group cursor-default transform hover:-translate-y-1 hover:shadow-lg">
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl shadow-inner ${tx.is_fraud ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-cyan-500/30'}`}>
                          {tx.receiver_account ? tx.receiver_account.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-white text-lg tracking-tight group-hover:text-cyan-400 transition-colors">{tx.receiver_account || 'Unknown'}</p>
                          <p className="text-sm text-gray-500 capitalize flex items-center gap-2 mt-1">
                            <span className="bg-gray-800 px-2 py-0.5 rounded-md">{tx.transaction_type}</span>
                            <span>•</span>
                            <span>{tx.location}</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`font-black text-xl ${tx.is_fraud ? 'text-gray-600 line-through' : 'text-white'}`}>
                          -${tx.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </p>
                        {tx.is_fraud ? (
                          <p className="text-xs font-black text-red-500 mt-2 flex items-center justify-end gap-1.5 uppercase tracking-wider bg-red-500/10 px-2 py-1 rounded-md inline-flex">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> BLOCKED BY AI
                          </p>
                        ) : (
                          <p className="text-xs font-black text-cyan-400 mt-2 flex items-center justify-end gap-1.5 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> COMPLETED
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
