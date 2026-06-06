import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ShieldAlert, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { securedFetch } from '../lib/api';
import { triggerSecOpsToast } from './ToastContainer';

interface RegisterFormProps {
  isDark: boolean;
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

export default function RegisterForm({ isDark, onRegisterSuccess, onNavigateToLogin }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const isEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setErrorMsg('Full Name is required.');
      triggerShake();
      return;
    }
    if (!trimmedEmail) {
      setErrorMsg('Email address is required.');
      triggerShake();
      return;
    }
    if (!isEmailValid(trimmedEmail)) {
      setErrorMsg('Invalid email format.');
      triggerShake();
      return;
    }
    if (!password) {
      setErrorMsg('Security key password is required.');
      triggerShake();
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      triggerShake();
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      triggerShake();
      return;
    }

    setIsLoading(true);

    securedFetch('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: trimmedEmail, name: trimmedName, password })
    })
      .then(() => {
        setIsLoading(false);
        triggerSecOpsToast('PROFILE PENDING VERIFICATION\nYour security profile has been initialized.', 'resolved');
        onRegisterSuccess();
      })
      .catch((err: any) => {
        setIsLoading(false);
        setErrorMsg(err.message || 'Registration handshake denied by perimeter.');
        triggerShake();
        triggerSecOpsToast('Handshake error occurred.', 'blocked');
      });
  };

  return (
    <div className={`w-full max-w-sm ${shake ? 'animate-shake' : ''}`}>
      <div className="text-center mb-6">
        <h2 className="font-display font-black text-2xl tracking-tight mb-1">
          Join Eurosia X
        </h2>
        <p className="text-xs font-sans text-gray-500">
          Provision your secure operator credentials
        </p>
      </div>

      {errorMsg && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2.5 p-3 rounded-lg border border-red-alert/30 bg-red-alert/10 text-[#ff7b73] text-xs mb-4"
        >
          <ShieldAlert size={15} className="flex-shrink-0 animate-bounce" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
        {/* Name Field */}
        <div>
          <label className="block text-[9px] font-mono tracking-widest font-bold text-gray-500 mb-1.5 uppercase">
            FULL NAME OR CALLSIGN
          </label>
          <div 
            className="relative rounded-lg border bg-dark/40 transition-all duration-200"
            style={{
              borderColor: isDark ? 'rgba(77, 141, 255, 0.35)' : 'rgba(10, 16, 37, 0.2)'
            }}
          >
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent-blue opacity-85">
              <UserIcon size={15} />
            </span>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Agent Smith"
              disabled={isLoading}
              className="w-full bg-transparent border-none py-3 pl-11 pr-4 focus:outline-none focus:ring-0 text-xs tracking-wide"
              style={{ color: isDark ? '#ffffff' : '#050816' }}
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-[9px] font-mono tracking-widest font-bold text-gray-500 mb-1.5 uppercase">
            EMAIL ADDRESS
          </label>
          <div 
            className="relative rounded-lg border bg-dark/40 transition-all duration-200"
            style={{
              borderColor: isDark ? 'rgba(77, 141, 255, 0.35)' : 'rgba(10, 16, 37, 0.2)'
            }}
          >
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent-blue opacity-85">
              <Mail size={15} />
            </span>
            <input 
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@eurosia.com"
              disabled={isLoading}
              className="w-full bg-transparent border-none py-3 pl-11 pr-4 focus:outline-none focus:ring-0 text-xs tracking-wide"
              style={{ color: isDark ? '#ffffff' : '#050816' }}
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-[9px] font-mono tracking-widest font-bold text-gray-500 mb-1.5 uppercase">
            SECURITY KEY (PASSWORD)
          </label>
          <div 
            className="relative rounded-lg border bg-dark/40 transition-all duration-200"
            style={{
              borderColor: isDark ? 'rgba(77, 141, 255, 0.35)' : 'rgba(10, 16, 37, 0.2)'
            }}
          >
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent-blue opacity-85">
              <Lock size={15} />
            </span>
            <input 
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full bg-transparent border-none py-3 pl-11 pr-11 focus:outline-none focus:ring-0 text-xs font-mono"
              style={{ color: isDark ? '#ffffff' : '#050816' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-accent-blue/80 hover:text-white cursor-pointer transition-colors"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-[9px] font-mono tracking-widest font-bold text-gray-500 mb-1.5 uppercase">
            CONFIRM SECURITY KEY
          </label>
          <div 
            className="relative rounded-lg border bg-dark/40 transition-all duration-200"
            style={{
              borderColor: isDark ? 'rgba(77, 141, 255, 0.35)' : 'rgba(10, 16, 37, 0.2)'
            }}
          >
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent-blue opacity-85">
              <Lock size={15} />
            </span>
            <input 
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full bg-transparent border-none py-3 pl-11/11 focus:outline-none focus:ring-0 text-xs font-mono"
              style={{ color: isDark ? '#ffffff' : '#050816', paddingLeft: '44px', paddingRight: '44px' }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 font-display text-xs font-bold tracking-widest text-white rounded-lg flex items-center justify-center gap-2 relative bg-gradient-to-r from-red-alert via-[#0057FF] to-[#4D8DFF] cursor-pointer hover:shadow-lg hover:shadow-blue-primary/10 transition-all duration-200 select-none disabled:opacity-60 disabled:cursor-wait"
        >
          {isLoading ? (
            <>
              <div className="w-4.5 h-4.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>PROVISIONING OPERATOR...</span>
            </>
          ) : (
            <>
              <span>PROVISION CLIENT ACCRESS</span>
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </form>

      <div className="flex items-center gap-3 my-5 select-none">
        <div className="flex-1 h-[1px]" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
        <span className="text-[9px] font-mono tracking-widest text-gray-500 font-extrabold text-xs">OR</span>
        <div className="flex-1 h-[1px]" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
      </div>

      <button
        type="button"
        onClick={onNavigateToLogin}
        className="w-full py-3 rounded-lg border border-dashed text-xs font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
        style={{
          borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(10, 16, 37, 0.18)',
          backgroundColor: isDark ? 'transparent' : 'rgba(10, 16, 37, 0.02)',
          color: isDark ? '#ffffff' : '#050816'
        }}
      >
        <span>ALREADY HAVE A KEY? HANDSHAKE RE-ENTRY</span>
      </button>
    </div>
  );
}
