import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Shield, ShieldAlert, LogIn, KeyRound } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useTheme } from '../contexts/ThemeContext';

export const Login: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);
  
  // Step 1 State: Station Selection
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedThana, setSelectedThana] = useState('');
  
  // Step 2 State: Authentication
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [otp, setOtp] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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

  const districtsData: Record<string, string[]> = {
    "Agra": ["Tajganj", "Hari Parvat", "Rakabganj", "Sikandra", "Shahganj"],
    "Aligarh": ["Civil Lines", "Banna Devi", "Sasni Gate", "Quarsi"],
    "Ambedkar Nagar": ["Akbarpur", "Jalalpur", "Tanda"],
    "Amethi": ["Amethi", "Gauriganj", "Jagdishpur", "Tiloi"],
    "Amroha": ["Amroha Nagar", "Dhanaura", "Hasanpur"],
    "Auraiya": ["Auraiya", "Bidhuna", "Dibiyapur"],
    "Ayodhya": ["Kotwali Ayodhya", "Cantt", "Faizabad Kotwali", "Rudauli"],
    "Azamgarh": ["Kotwali", "Nizamabad", "Mubarakpur", "Phulpur"],
    "Badaun": ["Civil Lines", "Kotwali", "Ujhani", "Bilsi"],
    "Baghpat": ["Baghpat", "Baraut", "Khekara"],
    "Bahraich": ["Kotwali Nagar", "Dargah Sharif", "Nanpara"],
    "Ballia": ["Kotwali", "Bansdih", "Rasra", "Bairia"],
    "Balrampur": ["Kotwali Nagar", "Tulsipur", "Utraula"],
    "Banda": ["Kotwali Nagar", "Attarra", "Baberu"],
    "Barabanki": ["Kotwali Nagar", "Ramsanehi Ghat", "Haidergarh", "Fatehpur"],
    "Bareilly": ["Kotwali", "Subhash Nagar", "Prem Nagar", "Izzatnagar", "Baradari"],
    "Basti": ["Kotwali", "Purani Basti", "Harraiya"],
    "Bhadohi": ["Gyanpur", "Bhadohi", "Aurai"],
    "Bijnor": ["Kotwali City", "Chandpur", "Najibabad", "Dhampur"],
    "Bulandshahr": ["Kotwali Nagar", "Khurja", "Sikandrabad"],
    "Chandauli": ["Mughalsarai", "Chandauli", "Sakaldiha"],
    "Chitrakoot": ["Karwi", "Rajapur", "Mau"],
    "Deoria": ["Kotwali", "Salempur", "Rudrapur", "Barhaj"],
    "Etah": ["Kotwali Nagar", "Aliganj", "Jalesar"],
    "Etawah": ["Kotwali", "Civil Lines", "Jaswantnagar", "Bharthana"],
    "Farrukhabad": ["Kotwali", "Fatehgarh", "Kaimganj"],
    "Fatehpur": ["Kotwali", "Bindki", "Khaga"],
    "Firozabad": ["North", "South", "Shikohabad", "Tundla"],
    "Gautam Buddha Nagar (Noida)": ["Sector 20", "Sector 39", "Sector 58", "Bisrakh", "Knowledge Park"],
    "Ghaziabad": ["Kotwali", "Sihani Gate", "Kavi Nagar", "Indirapuram", "Sahibabad"],
    "Ghazipur": ["Kotwali", "Zamania", "Muhammadabad", "Saidpur"],
    "Gonda": ["Kotwali Nagar", "Colonelganj", "Mankapur", "Tarabganj"],
    "Gorakhpur": ["Cantt", "Gorakhnath", "Kotwali", "Sahjanwa", "Chauri Chaura"],
    "Hamirpur": ["Kotwali", "Maudaha", "Rath"],
    "Hapur": ["Kotwali Nagar", "Pilkhuwa", "Garhmukteshwar"],
    "Hardoi": ["Kotwali City", "Sandila", "Shahabad", "Bilgram"],
    "Hathras": ["Kotwali", "Sikandra Rao", "Sadabad"],
    "Jalaun": ["Orai", "Konch", "Kalpi"],
    "Jaunpur": ["Kotwali", "Line Bazar", "Shahganj", "Machhlishahr"],
    "Jhansi": ["Kotwali", "Nawabad", "Sadar Bazar", "Mauranipur"],
    "Kannauj": ["Kotwali", "Tirwa", "Chhibramau"],
    "Kanpur Dehat": ["Akbarpur", "Rura", "Rasulabad"],
    "Kanpur Nagar": ["Kakadeo", "Swaroop Nagar", "Kalyanpur", "Chakeri", "Govind Nagar", "Kotwali", "Sisamau", "Colonelganj", "Gwaltoli", "Nawabganj", "Kohna", "Bithoor", "Fazalganj", "Nazirabad", "Anwar Ganj", "Beckonganj", "Babupurwa", "Kidwai Nagar", "Naubasta", "Barra", "Juhi"],
    "Kasganj": ["Kasganj", "Sahawar", "Patiyali"],
    "Kaushambi": ["Manjhanpur", "Sirathu", "Chail"],
    "Kheri (Lakhimpur)": ["Kotwali", "Gola", "Nighasan", "Palia"],
    "Kushinagar": ["Padrauna", "Kasya", "Tamkuhi Raj"],
    "Lalitpur": ["Kotwali", "Talbehat", "Mahroni"],
    "Lucknow": ["Hazratganj", "Gomti Nagar", "Chowk", "Indira Nagar", "Alambagh", "Aminabad", "Qaiserbagh", "Wazirganj", "Naka Hindola", "Hussainganj", "Ghazipur", "Mahanagar", "Vikas Nagar", "Gudamba", "Madion", "Aliganj", "Hasanganj", "Thakurganj", "Saadatganj", "Bazarkhala", "Talkatora", "Aashiana", "Sarojini Nagar", "Krishnanagar", "Cantt", "PGI", "Gosainganj", "Mohanlalganj", "Sushant Golf City", "Gomti Nagar Extension", "BBD", "Chinhat", "Kakori", "Malihabad", "Mal"],
    "Maharajganj": ["Kotwali", "Pharenda", "Nautanwa"],
    "Mahoba": ["Kotwali", "Charkhari", "Kulpahar"],
    "Mainpuri": ["Kotwali", "Bhongaon", "Karhal"],
    "Mathura": ["Kotwali", "Highway", "Vrindavan", "Kosi Kalan"],
    "Mau": ["Kotwali", "Kopaganj", "Ghosi", "Muhammadabad"],
    "Meerut": ["Kotwali", "Civil Lines", "Nauchandi", "Partapur", "Kankerkhera"],
    "Mirzapur": ["Kotwali", "Vindhyachal", "Chunar", "Lalganj"],
    "Moradabad": ["Kotwali", "Civil Lines", "Mugalpura", "Katghar", "Kanth"],
    "Muzaffarnagar": ["Kotwali Nagar", "Civil Lines", "Nai Mandi", "Khatauli"],
    "Pilibhit": ["Kotwali", "Bisalpur", "Puranpur"],
    "Pratapgarh": ["Kotwali Nagar", "Patti", "Kunda", "Lalganj"],
    "Prayagraj": ["Civil Lines", "Kydganj", "George Town", "Mutthiganj", "Colonelganj", "Kotwali", "Shahganj", "Khuldabad", "Kareli", "Attarsuiya", "Dhoomanganj", "Cantonment", "Shivkuti"],
    "Raebareli": ["Kotwali Nagar", "Salon", "Lalganj", "Unchahar"],
    "Rampur": ["Kotwali", "Civil Lines", "Milak", "Bilaspur"],
    "Saharanpur": ["Kotwali Nagar", "Qutubsher", "Deoband", "Nakur", "Sarsawa"],
    "Sambhal": ["Kotwali", "Chandausi", "Gunnaur"],
    "Sant Kabir Nagar": ["Khalilabad", "Mehdawal", "Dhanghata"],
    "Shahjahanpur": ["Kotwali", "Sadar Bazar", "Powayan", "Tilhar"],
    "Shamli": ["Kotwali", "Kairana", "Thana Bhawan"],
    "Shravasti": ["Bhinga", "Ikauna"],
    "Siddharthnagar": ["Naugarh", "Bansi", "Domariyaganj", "Itwa"],
    "Sitapur": ["Kotwali", "Laharpur", "Biswan", "Mahmudabad"],
    "Sonbhadra": ["Robertsganj", "Obra", "Renukoot", "Chopan"],
    "Sultanpur": ["Kotwali Nagar", "Kadipur", "Lambhua"],
    "Unnao": ["Kotwali", "Gangaghat", "Safipur", "Purwa"],
    "Varanasi": ["Lanka", "Bhelupur", "Cantonment", "Dashashwamedh", "Sigra", "Kotwali", "Chowk", "Adampur", "Jaitpura", "Chetganj", "Mahmoorganj", "Manduadih", "Rohania", "Ramnagar"]
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value);
    setSelectedThana(''); // Reset thana when district changes
  };



  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!selectedDistrict) return setError('Please select a District.');
    if (!selectedThana) return setError('Please select a Police Station (Thana).');
    
    // Save selected station details if needed globally, then move to step 2
    setStep(2);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
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
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // MOCK LOGIN SUCCESS
      const userPrefix = email.split('@')[0] || 'sho';
      localStorage.setItem('demoAuth', userPrefix);
      localStorage.setItem('demoDistrict', selectedDistrict || 'Lucknow');
      localStorage.setItem('demoThana', selectedThana || 'Hazratganj');
      navigate('/dashboard/duties');
      
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

        {step === 1 ? (
          <form onSubmit={handleStep1Submit} className="flex flex-col gap-6 stagger-3 text-white mt-4">
            
            {/* District Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#FF9933] ml-1 uppercase tracking-wider" htmlFor="district">
                1. Select District (ज़िला)
              </label>
              <div className="relative">
                <select 
                  id="district"
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white appearance-none focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/30 transition-all outline-none backdrop-blur-md cursor-pointer text-lg font-semibold"
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  required
                >
                  <option value="" disabled className="text-gray-900 bg-white">-- Select District --</option>
                  {Object.keys(districtsData).map((district) => (
                    <option key={district} value={district} className="text-gray-900 bg-white">
                      {district}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/70">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            {/* Police Station Dropdown (Dependent) */}
            <div className="flex flex-col gap-2 relative">
              <label className={`text-sm font-bold ml-1 uppercase tracking-wider transition-colors ${selectedDistrict ? 'text-[#FF9933]' : 'text-white/40'}`} htmlFor="thana">
                2. Select Police Station (थाना)
              </label>
              <div className="relative">
                <select 
                  id="thana"
                  className={`w-full px-4 py-4 bg-white/10 border rounded-xl appearance-none outline-none backdrop-blur-md text-lg font-semibold transition-all ${
                    selectedDistrict 
                      ? 'border-white/20 text-white cursor-pointer focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/30' 
                      : 'border-white/5 text-white/30 cursor-not-allowed bg-black/20'
                  }`}
                  value={selectedThana}
                  onChange={(e) => setSelectedThana(e.target.value)}
                  disabled={!selectedDistrict}
                  required
                >
                  <option value="" disabled className="text-gray-900 bg-white">
                    {selectedDistrict ? '-- Select Police Station --' : 'Select District First'}
                  </option>
                  {selectedDistrict && districtsData[selectedDistrict].map((thana) => (
                    <option key={thana} value={thana} className="text-gray-900 bg-white">
                      {thana}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/70">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
              {!selectedDistrict && (
                <div className="absolute inset-0 z-10 cursor-not-allowed" title="Please select a district first"></div>
              )}
            </div>
            
            <button 
              type="submit" 
              className={`w-full py-4 mt-6 font-bold rounded-xl shadow-[0_0_20px_rgba(255,153,51,0.4)] transition-all duration-300 flex items-center justify-center gap-2 text-lg ${
                selectedDistrict && selectedThana 
                  ? 'bg-gradient-to-r from-[#FF9933] to-[#ff8c1a] hover:from-[#ffaa55] hover:to-[#ff9e33] text-[#001229] hover:scale-[1.02] active:scale-95' 
                  : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/5 shadow-none'
              }`}
              disabled={!selectedDistrict || !selectedThana}
            >
              Continue to Login <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </form>
        ) : (
          <>
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

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5 stagger-3 text-white">
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
              
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="text-white/60 hover:text-white text-sm mt-2 transition-colors flex items-center justify-center gap-1"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg> Change Station
              </button>
            </form>
          </>
        )}
      </div>
      
      {/* Footer info */}
      <div className="absolute bottom-6 text-xs text-white/50 text-center w-full font-medium tracking-wide z-10">
         &copy; {new Date().getFullYear()} UTTAR PRADESH POLICE. ALL RIGHTS RESERVED.<br/>
         <span className="text-[#FF9933]/80 mt-1 inline-block">AUTHORIZED ACCESS ONLY.</span>
      </div>
    </div>
  );
};
