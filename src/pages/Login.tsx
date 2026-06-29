import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Shield, ShieldAlert, LogIn, KeyRound } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useTheme } from '../contexts/ThemeContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
  
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const handleRefreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setCaptchaValue('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email) return setError('Official Email or Username is required.');
    if (!email.endsWith('@uppolice.gov.in') && email.includes('@')) {
      return setError('Email must end with @uppolice.gov.in');
    }
    if (loginMethod === 'password' && !password) return setError('Password is required.');
    if (loginMethod === 'otp' && otp.length !== 6) return setError('Please enter a valid 6-digit OTP.');
    if (captchaValue.toUpperCase() !== captchaCode) return setError('Invalid CAPTCHA code.');

    setLoading(true);
    try {
      if (loginMethod === 'password') {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          navigate('/dashboard');
        } catch (firebaseErr: any) {
          // DEMO BYPASS: Allow specific demo credentials if Firebase fails/not-setup
          if (
            (email === 'admin@uppolice.gov.in' && password === 'admin123') ||
            (email === 'officer@uppolice.gov.in' && password === 'officer123')
          ) {
             navigate('/dashboard');
          } else {
             setError(firebaseErr.message || 'Failed to login. Check credentials.');
          }
        }
      } else {
        if (otp === '123456') navigate('/dashboard');
        else setError('Invalid OTP. Use 123456 for demo.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Stunning Abstract Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#001229]/85 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop" 
          alt="UP Police HQ" 
          className="absolute inset-0 w-full h-full object-cover filter blur-[2px] scale-105 opacity-60"
        />
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-accent)]/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-1000 z-10"></div>
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button onClick={toggleTheme} className="glass-panel p-3 rounded-full hover:scale-110 transition-transform text-white border-white/20">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
      
      {/* Premium Glass Card */}
      <div className="glass-card max-w-md w-full p-8 relative z-20 animate-fade-up">
        {/* Glow border effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-80 rounded-t-2xl"></div>
        
        <div className="flex flex-col items-center mb-8 stagger-1">
          <div className="flex gap-4 items-center mb-6">
            {/* UP Police Logo */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#002147] to-[#0d386b] flex items-center justify-center shadow-[0_0_20px_rgba(0,33,71,0.5)] border border-white/20">
               <Shield size={32} className="text-[#FF9933] filter drop-shadow-[0_0_8px_rgba(255,153,51,0.8)]" />
            </div>
            {/* PNO Logo */}
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20">
               <span className="font-heading font-extrabold text-xl text-white tracking-wider">PNO</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-heading font-bold text-center mb-2 text-white">
            Police Network Office
          </h1>
          <p className="text-blue-100/70 text-sm text-center font-medium tracking-wide">
            UTTAR PRADESH POLICE PORTAL
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-md border border-red-500/50 text-white text-sm rounded-xl flex items-start gap-3 animate-fade-up">
            <ShieldAlert size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Custom Segmented Control */}
        <div className="flex p-1 mb-8 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 stagger-2">
          <button 
            type="button"
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${loginMethod === 'password' ? 'bg-white text-[var(--color-primary-dark)] shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
            onClick={() => setLoginMethod('password')}
          >
            Password
          </button>
          <button 
            type="button"
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${loginMethod === 'otp' ? 'bg-white text-[var(--color-primary-dark)] shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
            onClick={() => setLoginMethod('otp')}
          >
            OTP Login
          </button>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5 stagger-3 text-white">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white/90 ml-1" htmlFor="email">Official Email / Username</label>
            <input 
              id="email"
              type="text" 
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/30 transition-all outline-none backdrop-blur-md" 
              placeholder="officer@uppolice.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {loginMethod === 'password' ? (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-white/90" htmlFor="password">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-[#FF9933] hover:text-[#ffaa55] hover:underline transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/30 transition-all outline-none backdrop-blur-md pr-12" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-white/90" htmlFor="otp">One Time Password</label>
                <button type="button" className="text-xs font-medium text-[#FF9933] hover:text-[#ffaa55] hover:underline transition-colors">
                  Resend OTP
                </button>
              </div>
              <input 
                id="otp"
                type="text" 
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/30 transition-all outline-none backdrop-blur-md tracking-[0.5em] text-center text-xl font-bold" 
                placeholder="------"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                required
              />
            </div>
          )}
          
          {/* Enhanced CAPTCHA Section */}
          <div className="flex flex-col gap-2 mt-2">
             <label className="text-sm font-semibold text-white/90 ml-1">Security Verification</label>
             <div className="flex gap-3">
               <div className="flex-1 bg-black/30 border border-white/20 rounded-xl flex items-center justify-center font-mono text-2xl font-bold tracking-[0.3em] text-white select-none relative overflow-hidden backdrop-blur-md">
                  {/* Captcha noise background */}
                  <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMNCA0Wk00IDBMMCA0WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] mix-blend-overlay"></div>
                  <span className="relative z-10 filter drop-shadow-md">{captchaCode}</span>
               </div>
               <button type="button" onClick={handleRefreshCaptcha} className="px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors flex items-center justify-center">
                 <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
               </button>
             </div>
             <input 
               type="text" 
               className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/30 transition-all outline-none backdrop-blur-md mt-2" 
               placeholder="Enter the code above"
               value={captchaValue}
               onChange={(e) => setCaptchaValue(e.target.value)}
               required
             />
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 mt-6 bg-gradient-to-r from-[#FF9933] to-[#ff8c1a] hover:from-[#ffaa55] hover:to-[#ff9e33] text-[#001229] font-bold rounded-xl shadow-[0_0_20px_rgba(255,153,51,0.4)] transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
            disabled={loading}
          >
            {loading ? (
               <div className="w-6 h-6 border-3 border-[#001229] border-t-transparent rounded-full animate-spin"></div>
            ) : (
               <><LogIn size={20} /> Secure Login</>
            )}
          </button>
        </form>

        <div className="mt-8 text-center stagger-3">
          <p className="text-sm text-white/70">
            Don't have an official account?{' '}
            <Link to="/signup" className="text-[#FF9933] font-bold hover:text-[#ffaa55] hover:underline transition-colors">
              Register Here
            </Link>
          </p>
        </div>

        {/* Demo Credentials Hint for Development */}
        <div className="mt-6 p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white/50 text-center animate-fade-up flex flex-col gap-1">
           <p className="font-semibold text-white/70 mb-1">Development Demo Access</p>
           <div className="flex justify-between px-4">
             <span><b className="text-[#FF9933]">Admin:</b> admin@uppolice.gov.in</span>
             <span><b className="text-[#FF9933]">Pass:</b> admin123</span>
           </div>
           <div className="flex justify-between px-4">
             <span><b className="text-[#FF9933]">Officer:</b> officer@uppolice.gov.in</span>
             <span><b className="text-[#FF9933]">Pass:</b> officer123</span>
           </div>
        </div>
      </div>
      
      {/* Footer info */}
      <div className="absolute bottom-6 text-xs text-white/50 text-center w-full font-medium tracking-wide z-10">
         &copy; {new Date().getFullYear()} UTTAR PRADESH POLICE. ALL RIGHTS RESERVED.<br/>
         <span className="text-[#FF9933]/80 mt-1 inline-block">AUTHORIZED ACCESS ONLY.</span>
      </div>
    </div>
  );
};
