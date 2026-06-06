import React, { useState } from 'react';
import { Mail, Lock, ShieldAlert, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { securedFetch } from '../lib/api';
import { triggerSecOpsToast } from './ToastContainer';

interface LoginFormProps {
  isDark: boolean;
  onLoginSuccess: (user: any) => void;
}

const DEMO_USERS = [
  { email: 'admin@eurosia.com', password: 'EUROSIA@Admin2024', name: 'Admin Operator', role: 'admin', redirect: '/admin' },
  { email: 'user@eurosia.com', password: 'User@2024', name: 'Security Analyst', role: 'analyst', redirect: '/dashboard' },
  { email: 'readonly@eurosia.com', password: 'Readonly@2024', name: 'Read-Only Operator', role: 'readonly', redirect: '/dashboard' },
];

export default function LoginForm({ isDark, onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const isEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setErrorMsg('Email address is required.');
      triggerShake();
      return;
    }
    if (!password) {
      setErrorMsg('Password is required.');
      triggerShake();
      return;
    }
    if (!isEmailValid(trimmedEmail)) {
      setErrorMsg('Invalid email format.');
      triggerShake();
      return;
    }

    setIsLoading(true);

    // Direct server-side authentication handshake trigger or offline auto-fallback
    securedFetch('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: trimmedEmail, password })
    })
      .then(res => {
        // Cache token
        localStorage.setItem('eurosia_token', res.token);
        triggerSecOpsToast(`SECURE NODE ESTABLISHED\nOperator: ${res.user.name} verified.`, 'resolved');
        onLoginSuccess(res.user);
      })
      .catch(err => {
        setIsLoading(false);
        setErrorMsg(err.message || 'Incorrect terminal token or system error.');
        triggerShake();
        triggerSecOpsToast(`HANDSHAKE FAILED\nAccess denied: ${err.message || 'unrecognized clearance'}`, 'blocked');
      });
  };

  const handleForgotPass = (e: React.MouseEvent) => {
    e.preventDefault();
    if (email.trim()) {
      triggerSecOpsToast(`SECURE LINK SENT\nPassword reset instructions dispatched to: ${email.trim()}`, 'resolved');
    } else {
      triggerSecOpsToast('CLEARANCE ERROR\nEnter your registered email address first, then request recovery.', 'blocked');
    }
  };

  const handleSSO = () => {
    triggerSecOpsToast('SSO PORTAL LINKED\nPlease configure your SAML 2.0 provider mapping inside administrative policies.', 'system');
  };

  return (
    <div className={`w-full max-w-sm ${shake ? 'animate-shake' : ''}`}>
      <div className="text-center mb-6">
        <h2 className="font-display font-black text-2xl tracking-tight mb-1">
          Welcome Back!
        </h2>
        <p className="text-xs font-sans text-gray-500">
          Sign in to access your direct SecOps dashboard
        </p>
      </div>

      {/* QUICK ROLE CHANGER SELECT PANEL */}
      <div className="mb-5 p-3 rounded-lg border border-dashed text-center"
        style={{
          borderColor: isDark ? 'rgba(77, 141, 255, 0.25)' : 'rgba(10, 16, 37, 0.15)',
          backgroundColor: isDark ? 'rgba(10, 16, 37, 0.4)' : 'rgba(10, 16, 37, 0.02)'
        }}>
        <div className="text-[9px] font-mono tracking-widest text-gray-400 font-extrabold mb-2 uppercase">
          QUICK-FILL TEST CLEARANCE ACCOUNTS
        </div>
        <div className="flex gap-2 justify-center">
          <button 
            type="button"
            onClick={() => { setEmail('admin@eurosia.com'); setPassword('EUROSIA@Admin2024'); }}
            className="text-[9px] font-mono font-black border border-red-500/30 hover:bg-red-500/10 px-2.5 py-1 rounded cursor-pointer transition-all duration-200 text-red-400">
            ADMINISTRATOR
          </button>
          <button 
            type="button"
            onClick={() => { setEmail('user@eurosia.com'); setPassword('User@2024'); }}
            className="text-[9px] font-mono font-black border border-blue-400/30 hover:bg-blue-400/10 px-2.5 py-1 rounded cursor-pointer transition-all duration-200 text-accent-blue">
            ANALYST
          </button>
          <button 
            type="button"
            onClick={() => { setEmail('readonly@eurosia.com'); setPassword('Readonly@2024'); }}
            className="text-[9px] font-mono font-black border border-gray-400/30 hover:bg-gray-400/10 px-2.5 py-1 rounded cursor-pointer transition-all duration-200 text-slate-400">
            READ-ONLY
          </button>
        </div>
      </div>

      {/* ERROR STATUS INDICATOR */}
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

      <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
        {/* Email Field */}
        <div>
          <label className="block text-[9px] font-mono tracking-widest font-bold text-gray-500 mb-1.5 uppercase">
            EMAIL ADDRESS
          </label>
          <div 
            className="relative rounded-lg border bg-dark/40 transition-all duration-200"
            style={{
              borderColor: errorMsg
                ? 'var(--color-red-alert)'
                : isEmailValid(email)
                ? 'var(--color-green-alert)'
                : isDark
                ? 'rgba(77, 141, 255, 0.35)'
                : 'rgba(10, 16, 37, 0.2)'
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
          <div className="flex justify-between items-center mb-1.5 uppercase tracking-widest text-[9px] font-mono font-bold">
            <span className="text-gray-500">PASSWORD</span>
            <a 
              href="#forgot-password" 
              onClick={handleForgotPass}
              className="text-accent-blue hover:text-blue-primary transition-colors cursor-pointer"
            >
              Forgot Password?
            </a>
          </div>

          <div 
            className="relative rounded-lg border bg-dark/40 transition-all duration-200"
            style={{
              borderColor: errorMsg
                ? 'var(--color-red-alert)'
                : isDark
                ? 'rgba(77, 141, 255, 0.35)'
                : 'rgba(10, 16, 37, 0.2)'
            }}
          >
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent-blue opacity-85">
              <Lock size={15} />
            </span>
            <input 
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your security token"
              disabled={isLoading}
              className="w-full bg-transparent border-none py-3 pl-11 pr-11 focus:outline-none focus:ring-0 text-xs font-mono font-black placeholder:font-sans placeholder:font-normal"
              style={{ color: isDark ? '#ffffff' : '#050816' }}
            />
            {/* Password hide/show toggle */}
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

        {/* Submit Transceiver Lock Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 font-display text-xs font-bold tracking-widest text-white rounded-lg flex items-center justify-center gap-2 relative bg-gradient-to-r from-red-alert via-[#0057FF] to-[#4D8DFF] cursor-pointer hover:shadow-lg hover:shadow-blue-primary/10 transition-all duration-200 select-none disabled:opacity-60 disabled:cursor-wait"
        >
          {isLoading ? (
            <>
              <div className="w-4.5 h-4.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>AUTHENTICATING NODE...</span>
            </>
          ) : (
            <>
              <span>CONNECT SECURE PATH</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Or Row */}
      <div className="flex items-center gap-3 my-5 select-none">
        <div className="flex-1 h-[1px]" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
        <span className="text-[9px] font-mono tracking-widest text-gray-500 font-extrabold text-xs">OR</span>
        <div className="flex-1 h-[1px]" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
      </div>

      {/* SSO Login */}
      <button
        onClick={handleSSO}
        className="w-full py-3 rounded-lg border border-dashed text-xs font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
        style={{
          borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(10, 16, 37, 0.18)',
          backgroundColor: isDark ? 'transparent' : 'rgba(10, 16, 37, 0.02)',
          color: isDark ? '#ffffff' : '#050816'
        }}
      >
        <ShieldAlert size={14} className="text-accent-blue" />
        <span>ENTERPRISE FEDERATED SSO</span>
      </button>

      {/* Admin details footer */}
      <div className="text-center mt-6 text-gray-500 select-none text-[10px]">
        Do not have a transceiver key?{' '}
        <a 
          href="#admin-request"
          onClick={() => triggerSecOpsToast('REGISTRATION SENT\nOperator request successfully submitted to security administration.', 'system')} 
          className="text-accent-blue hover:underline whitespace-nowrap"
        >
          Contact Systems Administrator
        </a>
      </div>
    </div>
  );
}
