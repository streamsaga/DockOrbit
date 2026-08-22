import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser, showToast } = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (isSignUp && !otpSent) {
        setOtpSent(true);
        showToast('Verification OTP sent to ' + email);
      } else {
        setUser(prev => ({
          ...prev,
          email: email,
          name: email.split('@')[0].replace('.', ' ')
        }));
        showToast('Welcome back to DockOrbit!');
        navigate('/user-dashboard');
      }
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 140px)', padding: '20px' }}>
      <div className="soft-card-static" style={{ width: '100%', maxWidth: '440px', padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Brand */}
        <div style={{ textTransform: 'center', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '22px' }}>
            DO
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
            DockOrbit
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
            Your smarter way to discover YouTube.
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={{ display: 'flex', background: 'var(--bg-surface-soft)', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => { setIsSignUp(false); setOtpSent(false); }}
            style={{ flex: 1, padding: '8px', borderRadius: '8px', fontSize: '13.5px', fontWeight: !isSignUp ? 700 : 500, background: !isSignUp ? 'var(--bg-surface)' : 'transparent', color: !isSignUp ? 'var(--primary)' : 'var(--text-muted)', boxShadow: !isSignUp ? 'var(--shadow-soft-sm)' : 'none' }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsSignUp(true); setOtpSent(false); }}
            style={{ flex: 1, padding: '8px', borderRadius: '8px', fontSize: '13.5px', fontWeight: isSignUp ? 700 : 500, background: isSignUp ? 'var(--bg-surface)' : 'transparent', color: isSignUp ? 'var(--primary)' : 'var(--text-muted)', boxShadow: isSignUp ? 'var(--shadow-soft-sm)' : 'none' }}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{ padding: '10px 14px', background: 'var(--error-bg)', color: 'var(--error)', border: '1px solid var(--error)33', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!otpSent ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)' }}>Email Address</label>
                <div className="soft-inset" style={{ padding: '10px 14px' }}>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ border: 'none', background: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '14px', width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)' }}>Password</label>
                <div className="soft-inset" style={{ padding: '10px 14px' }}>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ border: 'none', background: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '14px', width: '100%' }}
                  />
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)' }}>Enter 6-Digit Verification Code</label>
              <div className="soft-inset" style={{ padding: '10px 14px' }}>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  style={{ border: 'none', background: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '18px', textAlign: 'center', letterSpacing: '0.2em', fontWeight: 800, width: '100%' }}
                />
              </div>
            </div>
          )}

          <button type="submit" disabled={isLoading} className="soft-btn-primary" style={{ padding: '12px', fontSize: '14px', justifyContent: 'center', marginTop: '8px' }}>
            {isLoading ? 'Processing...' : otpSent ? 'Verify & Access Platform' : isSignUp ? 'Continue with Email' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-subtle)', fontSize: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
          <span>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
        </div>

        {/* Social SSO Button */}
        <button
          onClick={() => {
            setUser(prev => ({ ...prev, name: 'Alex Rivera (Google SSO)' }));
            showToast('Signed in with Google');
            navigate('/user-dashboard');
          }}
          className="soft-btn"
          style={{ padding: '12px', justifyContent: 'center', fontSize: '13.5px' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}
