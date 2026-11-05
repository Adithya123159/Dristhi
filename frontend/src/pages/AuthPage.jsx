import React, { useState } from 'react';
import { 
  Bird, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  ShieldCheck,
  Feather
} from 'lucide-react';
import { api } from '../services/api';

export default function AuthPage({ 
  initialMode = 'login', 
  onSuccess, 
  onNavigateHome,
  onSkip 
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        const res = await api.register(name, email, password);
        setSuccessMsg('Account created successfully! Welcome aboard.');
        setTimeout(() => {
          if (onSuccess) onSuccess(res.user);
        }, 800);
      } else {
        const res = await api.login(email, password);
        setSuccessMsg(`Welcome back, ${res.user.name || 'Naturalist'}!`);
        setTimeout(() => {
          if (onSuccess) onSuccess(res.user);
        }, 600);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('explorer@avian.ai');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-100/50 via-green-50/40 to-emerald-50 text-slate-800 flex flex-col justify-center items-center px-4 py-12 relative selection:bg-emerald-600 selection:text-white overflow-hidden">
      
      {/* Bird silhouettes in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg 
          className="absolute top-8 left-10 w-64 h-36 text-emerald-800/15" 
          viewBox="0 0 260 140" 
          fill="currentColor"
        >
          <path d="M 50 35 Q 75 10 110 30 Q 140 10 170 35 Q 120 28 110 48 Q 100 28 50 35 Z" />
          <path d="M 170 55 Q 185 40 210 52 Q 225 40 240 55 Q 215 51 210 65 Q 205 51 170 55 Z" />
        </svg>

        <svg 
          className="absolute bottom-12 right-10 w-72 h-44 text-emerald-800/15" 
          viewBox="0 0 280 160" 
          fill="currentColor"
        >
          <path d="M 210 20 Q 225 8 245 18 Q 260 8 275 20 Q 250 16 245 28 Q 240 16 210 20 Z" />
          <path d="M 160 40 Q 173 30 190 38 Q 202 30 215 40 Q 195 37 190 46 Q 185 37 160 40 Z" />
        </svg>
      </div>

      {/* Top Bar Navigation */}
      <div className="absolute top-6 left-6 right-6 max-w-4xl mx-auto flex items-center justify-between z-20">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-emerald-200 text-emerald-900 hover:text-emerald-950 hover:bg-emerald-50 transition-all text-xs font-semibold shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing</span>
        </button>

        <button
          onClick={onSkip}
          className="text-xs text-emerald-800 hover:text-emerald-950 transition-colors font-semibold"
        >
          Explore as Guest &rarr;
        </button>
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div 
            onClick={onNavigateHome}
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-600 shadow-sm shadow-emerald-600/30 mb-3 cursor-pointer hover:scale-105 transition-transform"
          >
            <Bird className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-emerald-950">
            {mode === 'login' ? 'Sign in to AvianAI' : 'Create an Account'}
          </h2>
          <p className="text-xs text-emerald-800/80 font-medium mt-1 max-w-xs mx-auto">
            {mode === 'login' 
              ? 'Enter your credentials to access your ecological observation history.' 
              : 'Join to classify and save native Indian bird species.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="bg-emerald-100/70 border border-emerald-200 p-1 rounded-xl flex items-center mb-5">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-emerald-800 hover:text-emerald-950'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-emerald-800 hover:text-emerald-950'
            }`}
          >
            Register
          </button>
        </div>

        {/* Auth Box */}
        <div className="bg-white/95 backdrop-blur-sm border border-emerald-200 rounded-3xl p-6 sm:p-7 shadow-sm shadow-emerald-900/5 relative">
          {/* Notifications */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-emerald-600/70 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Arun Sharma"
                    className="w-full bg-emerald-50/40 border border-emerald-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-emerald-950 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-emerald-600/70 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="naturalist@example.com"
                  className="w-full bg-emerald-50/40 border border-emerald-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-emerald-950">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={fillDemoAccount}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold"
                  >
                    Use Demo Account
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-600/70 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-emerald-50/40 border border-emerald-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl pl-9 pr-9 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-emerald-950 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-emerald-600/70 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-emerald-50/40 border border-emerald-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Free Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Switch Prompt */}
          <div className="mt-5 pt-4 border-t border-emerald-100 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-emerald-800">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(''); }}
                  className="font-bold text-emerald-700 hover:text-emerald-900 underline"
                >
                  Register here
                </button>
              </p>
            ) : (
              <p className="text-xs text-emerald-800">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className="font-bold text-emerald-700 hover:text-emerald-900 underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Security badge footer */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-emerald-800/80 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Local secure authentication with SQLite persistence</span>
        </div>
      </div>
    </div>
  );
}
