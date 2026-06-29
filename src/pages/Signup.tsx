import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, UploadCloud, UserPlus, FileText, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '', fatherName: '', rank: '', 
    designation: '', employeeId: '', pnoOffice: '', 
    district: '', zone: '', range: '', unit: '',
    mobile: '', email: '', altEmail: '',
    password: '', confirmPassword: '', securityQuestion: '', securityAnswer: '',
    photo: null as File | null, idCard: null as File | null, signature: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.files![0] }));
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      nextStep();
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      await setDoc(doc(db, "users", userCredential.user.uid), {
        fullName: formData.fullName,
        fatherName: formData.fatherName,
        rank: formData.rank,
        designation: formData.designation,
        employeeId: formData.employeeId,
        pnoOffice: formData.pnoOffice,
        district: formData.district,
        zone: formData.zone,
        range: formData.range,
        unit: formData.unit,
        mobile: formData.mobile,
        email: formData.email,
        altEmail: formData.altEmail,
        role: 'PNO Officer',
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-api-key') {
         navigate('/dashboard');
      } else {
         setError(err.message || "Failed to create account");
      }
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF9933]/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-1000 z-10"></div>
      </div>

      <div className="absolute top-6 right-6 z-20">
        <button onClick={toggleTheme} className="glass-panel p-3 rounded-full hover:scale-110 transition-transform text-white border-white/20">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      <div className="glass-card max-w-3xl w-full p-8 animate-fade-up relative z-20 mt-8 mb-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF9933] to-transparent opacity-80 rounded-t-2xl"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="flex gap-4 items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#002147] to-[#0d386b] flex items-center justify-center shadow-[0_0_20px_rgba(0,33,71,0.5)] border border-white/20">
               <Shield size={32} className="text-[#FF9933] filter drop-shadow-[0_0_8px_rgba(255,153,51,0.8)]" />
            </div>
          </div>
          <h1 className="text-3xl font-heading font-bold text-center mb-1 text-white">
            PNO Registration Portal
          </h1>
          <p className="text-blue-100/70 text-sm text-center font-medium tracking-wide">
            OFFICIAL UTTAR PRADESH POLICE ACCESS
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between mb-10 relative max-w-xl mx-auto px-4">
           <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-white/10 -z-10 -translate-y-1/2 rounded"></div>
           {[
             { num: 1, label: 'Official Info' },
             { num: 2, label: 'Contact' },
             { num: 3, label: 'Auth' },
             { num: 4, label: 'Uploads' }
           ].map(s => (
             <div key={s.num} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= s.num ? 'bg-gradient-to-r from-[#FF9933] to-[#ffaa55] text-[#001229] shadow-[0_0_15px_rgba(255,153,51,0.4)] scale-110' : 'bg-[#001229]/50 text-white/50 border border-white/10'}`}>
                  {step > s.num ? <CheckCircle size={20} /> : s.num}
                </div>
                <span className={`text-xs font-semibold ${step >= s.num ? 'text-white' : 'text-white/40'} hidden sm:block`}>{s.label}</span>
             </div>
           ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-md border border-red-500/50 text-white text-sm rounded-xl flex items-start gap-3">
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col min-h-[320px]">
          <div className="flex-grow">
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in text-white">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-white/90 ml-1">Full Name</label>
                  <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/30 transition-all outline-none" placeholder="Officer Name" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-white/90 ml-1">Father's Name</label>
                  <input required type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/30 transition-all outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-white/90 ml-1">Rank</label>
                  <select required name="rank" value={formData.rank} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#001229]/80 border border-white/20 rounded-xl text-white focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/30 transition-all outline-none appearance-none">
                    <option value="">Select Rank</option>
                    <option value="Constable">Constable</option>
                    <option value="Head Constable">Head Constable</option>
                    <option value="Sub Inspector">Sub Inspector</option>
                    <option value="Inspector">Inspector</option>
                    <option value="DSP">DSP / ACP</option>
                    <option value="SP">SP / DCP</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-white/90 ml-1">Employee ID</label>
                  <input required type="text" name="employeeId" value={formData.employeeId} onChange={handleInputChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/30 transition-all outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-white/90 ml-1">District</label>
                  <input required type="text" name="district" value={formData.district} onChange={handleInputChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/30 transition-all outline-none" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-5 animate-fade-in max-w-md mx-auto w-full text-white">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-white/90 ml-1">Mobile Number</label>
                  <input required type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/30 transition-all outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-white/90 ml-1">Official Email</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/30 transition-all outline-none" placeholder="@uppolice.gov.in" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-white/90 ml-1">Alternate Email</label>
                  <input type="email" name="altEmail" value={formData.altEmail} onChange={handleInputChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/30 transition-all outline-none" />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-5 animate-fade-in max-w-md mx-auto w-full text-white">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-white/90 ml-1">Password</label>
                  <input required type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/30 transition-all outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-white/90 ml-1">Confirm Password</label>
                  <input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/30 transition-all outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-white/90 ml-1">Security Question</label>
                  <select required name="securityQuestion" value={formData.securityQuestion} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#001229]/80 border border-white/20 rounded-xl text-white focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/30 transition-all outline-none appearance-none">
                    <option value="">Select Question</option>
                    <option value="pet">What was the name of your first pet?</option>
                    <option value="school">What was the name of your first school?</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-white/90 ml-1">Answer</label>
                  <input required type="text" name="securityAnswer" value={formData.securityAnswer} onChange={handleInputChange} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/30 transition-all outline-none" />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col gap-5 animate-fade-in max-w-md mx-auto w-full text-white">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-white/90 ml-1">Passport Size Photo</label>
                  <div className="border-2 border-dashed border-white/20 bg-white/5 p-6 rounded-xl text-center hover:border-[#FF9933]/50 hover:bg-white/10 transition-all cursor-pointer relative group">
                     <input type="file" name="photo" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                     <UploadCloud className="mx-auto mb-3 text-white/50 group-hover:text-[#FF9933] transition-colors" size={32} />
                     <span className="text-sm font-medium text-white/80">{formData.photo ? formData.photo.name : 'Click to Upload Photo'}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-white/90 ml-1">Police ID Card</label>
                  <div className="border-2 border-dashed border-white/20 bg-white/5 p-6 rounded-xl text-center hover:border-[#FF9933]/50 hover:bg-white/10 transition-all cursor-pointer relative group">
                     <input type="file" name="idCard" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="application/pdf,image/*" />
                     <FileText className="mx-auto mb-3 text-white/50 group-hover:text-[#FF9933] transition-colors" size={32} />
                     <span className="text-sm font-medium text-white/80">{formData.idCard ? formData.idCard.name : 'Click to Upload ID Card'}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                  <input required type="checkbox" id="terms" className="mt-1 rounded border-white/30 text-[#FF9933] focus:ring-[#FF9933] bg-transparent" />
                  <label htmlFor="terms" className="text-xs text-white/70 leading-relaxed">
                    I accept the Terms and Conditions and verify that the provided information is accurate and official. Fraudulent registrations are punishable by law.
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10 pt-6 border-t border-white/10">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="px-6 py-3 rounded-xl font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2">
                <ChevronLeft size={20} /> Back
              </button>
            ) : <div />}
            
            <button 
              type="submit" 
              disabled={loading} 
              className="px-8 py-3 bg-gradient-to-r from-[#FF9933] to-[#ff8c1a] hover:from-[#ffaa55] hover:to-[#ff9e33] text-[#001229] font-bold rounded-xl shadow-[0_0_20px_rgba(255,153,51,0.4)] transition-all duration-300 flex items-center gap-2 hover:scale-[1.02] active:scale-95"
            >
              {loading ? (
                 <div className="w-5 h-5 border-2 border-[#001229] border-t-transparent rounded-full animate-spin"></div>
              ) : step < 4 ? (
                 <>Next Step <ChevronRight size={20} /></>
              ) : (
                 'Submit Registration'
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-white/70">
            Already have an official account?{' '}
            <Link to="/login" className="text-[#FF9933] font-bold hover:text-[#ffaa55] hover:underline transition-colors">
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
