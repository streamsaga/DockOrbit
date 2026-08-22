import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { resizeImageToDataUrl } from '../utils/imageResize.js';

const MODES = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  VERIFY_SIGNUP: 'verify-signup',
  FORGOT_EMAIL: 'forgot-email',
  FORGOT_OTP: 'forgot-otp',
  RESET_PASSWORD: 'reset-password'
};

export default function AuthPage() {
  const [mode, setMode] = useState(MODES.LOGIN);

  // Signup fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarDataUrl, setAvatarDataUrl] = useState(null);
  const [avatarProcessing, setAvatarProcessing] = useState(false);

  // OTP fields
  const [otpCode, setOtpCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Password reset fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // UI state
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { login, signup, verifySignupOtp, resendOtp, forgotPassword, resetPassword } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const startResendCooldown = () => {
    setResendCooldown(30);
  };

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!/^image\/(png|jpeg|jpg)$/.test(file.type)) {
      setErrorMsg('Please select a PNG or JPG image.');
      return;
    }

    setErrorMsg('');
    setAvatarProcessing(true);
    try {
      const dataUrl = await resizeImageToDataUrl(file, 480, 0.85);
      setAvatarDataUrl(dataUrl);
    } catch (err) {
      setErrorMsg(err.message || 'Image processing failed');
    } finally {
      setAvatarProcessing(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      await login(email, password);
      showToast('Welcome back to DockOrbit!', 'success');
      navigate('/user-dashboard');
    } catch (err) {
      if (err.requiresVerification) {
        setMode(MODES.VERIFY_SIGNUP);
        showToast('Please verify your email code', 'info');
      } else {
        setErrorMsg(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Full Name is required.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const username = email.split('@')[0].replace(/[^a-z0-9_]/gi, '_').toLowerCase().slice(0, 20) || 'user';
      await signup({
        name,
        username,
        email,
        password,
        avatarDataUrl,
        favoriteCategory: null
      });
      setOtpCode('');
      setMode(MODES.VERIFY_SIGNUP);
      startResendCooldown();
      showToast(`Verification code sent to ${email}`, 'info');
    } catch (err) {
      setErrorMsg(err.message || 'Account creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifySignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpCode.trim().length !== 6) {
      setErrorMsg('Please enter the full 6-digit verification code.');
      return;
    }

    setSubmitting(true);
    try {
      await verifySignupOtp(email, otpCode);
      showToast('Email verified! Welcome to DockOrbit.', 'success');
      navigate('/user-dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid or expired code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendSignupCode = async () => {
    if (resendCooldown > 0) return;
    setErrorMsg('');
    try {
      await resendOtp(email, mode === MODES.VERIFY_SIGNUP ? 'signup' : 'reset');
      startResendCooldown();
      showToast(`Verification code resent to ${email}`, 'success');
    } catch (err) {
      setErrorMsg(err.message || 'Could not resend code');
    }
  };

  const handleForgotEmailSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      await forgotPassword(email);
      setOtpCode('');
      setMode(MODES.FORGOT_OTP);
      startResendCooldown();
      showToast(`Password reset code sent to ${email}`, 'info');
    } catch (err) {
      setErrorMsg(err.message || 'Request failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotOtpSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpCode.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }
    setMode(MODES.RESET_PASSWORD);
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(email, otpCode, newPassword);
      showToast('Password reset successfully. Please log in.', 'success');
      setMode(MODES.LOGIN);
      setPassword('');
      setOtpCode('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Password reset failed. Please request a new code.');
    } finally {
      setSubmitting(false);
    }
  };

  const initialsAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=4F46E5&color=fff`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 140px)', padding: '20px' }}>
      <div className="soft-card-static" style={{ width: '100%', maxWidth: '460px', padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#4F46E5', margin: 0, letterSpacing: '-0.03em' }}>
            DockOrbit
          </h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0 }}>
            Quality content discovery & verification platform
          </p>
        </div>

        {/* Tab Toggle (Only show on LOGIN / SIGNUP modes) */}
        {(mode === MODES.LOGIN || mode === MODES.SIGNUP) && (
          <div style={{ display: 'flex', background: 'var(--bg-surface-soft)', padding: '4px', borderRadius: '10px' }}>
            <button
              onClick={() => { setMode(MODES.LOGIN); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                fontSize: '13.5px',
                fontWeight: mode === MODES.LOGIN ? 700 : 500,
                background: mode === MODES.LOGIN ? 'var(--bg-surface)' : 'transparent',
                color: mode === MODES.LOGIN ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: mode === MODES.LOGIN ? 'var(--shadow-soft-sm)' : 'none'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode(MODES.SIGNUP); setErrorMsg(''); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                fontSize: '13.5px',
                fontWeight: mode === MODES.SIGNUP ? 700 : 500,
                background: mode === MODES.SIGNUP ? 'var(--bg-surface)' : 'transparent',
                color: mode === MODES.SIGNUP ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: mode === MODES.SIGNUP ? 'var(--shadow-soft-sm)' : 'none'
              }}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div style={{ padding: '12px 14px', background: 'var(--error-bg)', color: 'var(--error)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* ── MODE 1: LOGIN ── */}
        {mode === MODES.LOGIN && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)' }}>Email Address</label>
              <div className="soft-inset" style={{ padding: '10px 14px' }}>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ border: 'none', background: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '14px', width: '100%' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)' }}>Password</label>
                <button
                  type="button"
                  onClick={() => { setMode(MODES.FORGOT_EMAIL); setErrorMsg(''); }}
                  style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Forgot password?
                </button>
              </div>
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

            <button type="submit" disabled={submitting} className="soft-btn-primary" style={{ padding: '12px', fontSize: '14px', justifyContent: 'center', marginTop: '8px' }}>
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* ── MODE 2: SIGNUP ── */}
        {mode === MODES.SIGNUP && (
          <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Profile Picture Upload Section */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px dashed var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', background: 'var(--bg-surface-soft)', position: 'relative' }}
                title="Click to upload profile photo"
              >
                <img
                  src={avatarDataUrl || initialsAvatar}
                  alt="Profile preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {avatarProcessing && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Resizing...
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleAvatarFileChange}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {avatarDataUrl ? 'Change Profile Photo' : '📷 Upload Photo (Optional)'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)' }}>Full Name</label>
              <div className="soft-inset" style={{ padding: '10px 14px' }}>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Connor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ border: 'none', background: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '14px', width: '100%' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)' }}>Email Address</label>
              <div className="soft-inset" style={{ padding: '10px 14px' }}>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
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
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ border: 'none', background: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '14px', width: '100%' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)' }}>Confirm Password</label>
              <div className="soft-inset" style={{ padding: '10px 14px' }}>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ border: 'none', background: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '14px', width: '100%' }}
                />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="soft-btn-primary" style={{ padding: '12px', fontSize: '14px', justifyContent: 'center', marginTop: '8px' }}>
              {submitting ? 'Sending Code...' : 'Create Account & Verify Email'}
            </button>
          </form>
        )}

        {/* ── MODE 3: SIGNUP OTP VERIFICATION ── */}
        {mode === MODES.VERIFY_SIGNUP && (
          <form onSubmit={handleVerifySignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                Check your email
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0 }}>
                We sent a 6-digit verification code to <strong>{email}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)', textAlign: 'center' }}>
                Enter 6-Digit Code
              </label>
              <div className="soft-inset" style={{ padding: '12px 14px' }}>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  style={{ border: 'none', background: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '22px', textAlign: 'center', letterSpacing: '0.25em', fontWeight: 900, width: '100%' }}
                />
              </div>
              <span style={{ fontSize: '11.5px', color: 'var(--text-subtle)', textAlign: 'center' }}>
                Code expires in ~10 minutes
              </span>
            </div>

            <button type="submit" disabled={submitting} className="soft-btn-primary" style={{ padding: '12px', fontSize: '14px', justifyContent: 'center', marginTop: '8px' }}>
              {submitting ? 'Verifying...' : 'Verify Code & Complete Setup'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px' }}>
              <button
                type="button"
                onClick={() => setMode(MODES.SIGNUP)}
                style={{ fontSize: '12.5px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ← Back to Edit
              </button>
              <button
                type="button"
                disabled={resendCooldown > 0}
                onClick={handleResendSignupCode}
                style={{ fontSize: '12.5px', color: resendCooldown > 0 ? 'var(--text-subtle)' : 'var(--primary)', fontWeight: 700, background: 'none', border: 'none', cursor: resendCooldown > 0 ? 'default' : 'pointer' }}
              >
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
              </button>
            </div>
          </form>
        )}

        {/* ── MODE 4: FORGOT PASSWORD - EMAIL ── */}
        {mode === MODES.FORGOT_EMAIL && (
          <form onSubmit={handleForgotEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                Reset Your Password
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0 }}>
                Enter your registered email address and we'll send you a 6-digit verification code.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)' }}>Email Address</label>
              <div className="soft-inset" style={{ padding: '10px 14px' }}>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ border: 'none', background: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '14px', width: '100%' }}
                />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="soft-btn-primary" style={{ padding: '12px', fontSize: '14px', justifyContent: 'center', marginTop: '8px' }}>
              {submitting ? 'Sending Code...' : 'Send Password Reset Code'}
            </button>

            <button
              type="button"
              onClick={() => { setMode(MODES.LOGIN); setErrorMsg(''); }}
              style={{ fontSize: '12.5px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center' }}
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        {/* ── MODE 5: FORGOT PASSWORD - OTP VERIFICATION ── */}
        {mode === MODES.FORGOT_OTP && (
          <form onSubmit={handleForgotOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                Enter Reset Code
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0 }}>
                Enter the 6-digit code sent to <strong>{email}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)', textAlign: 'center' }}>
                6-Digit Reset Code
              </label>
              <div className="soft-inset" style={{ padding: '12px 14px' }}>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  style={{ border: 'none', background: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '22px', textAlign: 'center', letterSpacing: '0.25em', fontWeight: 900, width: '100%' }}
                />
              </div>
            </div>

            <button type="submit" className="soft-btn-primary" style={{ padding: '12px', fontSize: '14px', justifyContent: 'center', marginTop: '8px' }}>
              Continue to Set New Password →
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px' }}>
              <button
                type="button"
                onClick={() => setMode(MODES.FORGOT_EMAIL)}
                style={{ fontSize: '12.5px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ← Change Email
              </button>
              <button
                type="button"
                disabled={resendCooldown > 0}
                onClick={handleResendSignupCode}
                style={{ fontSize: '12.5px', color: resendCooldown > 0 ? 'var(--text-subtle)' : 'var(--primary)', fontWeight: 700, background: 'none', border: 'none', cursor: resendCooldown > 0 ? 'default' : 'pointer' }}
              >
                {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
              </button>
            </div>
          </form>
        )}

        {/* ── MODE 6: SET NEW PASSWORD ── */}
        {mode === MODES.RESET_PASSWORD && (
          <form onSubmit={handleResetPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                Set New Password
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0 }}>
                Choose a strong new password for your account.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)' }}>New Password</label>
              <div className="soft-inset" style={{ padding: '10px 14px' }}>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ border: 'none', background: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '14px', width: '100%' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)' }}>Confirm New Password</label>
              <div className="soft-inset" style={{ padding: '10px 14px' }}>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Re-enter new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  style={{ border: 'none', background: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '14px', width: '100%' }}
                />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="soft-btn-primary" style={{ padding: '12px', fontSize: '14px', justifyContent: 'center', marginTop: '8px' }}>
              {submitting ? 'Resetting Password...' : 'Save New Password & Sign In'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
