import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Logo } from '../components/Logo';

export const LoginPage = ({ navigate, initialMode = 'login', returnTo = '/account' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const { loginUser, registerUser, authError, setAuthError, isLoading } = useAuth();
  const { showToast } = useToast();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setAuthError('Please enter both your email and password.');
      return;
    }

    const res = await loginUser(loginEmail, loginPassword);
    if (res.success) {
      showToast(`Welcome back, ${res.user?.name || 'Customer'}!`, 'success');
      navigate(returnTo);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setAuthError('Please fill in all required fields.');
      return;
    }

    if (regPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    const res = await registerUser({
      name: regName,
      email: regEmail,
      password: regPassword,
      phone: regPhone
    });

    if (res.success) {
      showToast('Account created successfully! Welcome to MadurFresh.', 'success');
      navigate(returnTo);
    }
  };

  const switchMode = (newMode) => {
    setAuthError('');
    setMode(newMode);
  };

  return (
    <div className="auth-page-wrapper animate-fade-in">
      <div className="auth-card-container">
        {/* Top Header & Brand */}
        <div className="auth-brand-header">
          <div
            className="auth-logo-wrap"
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            <Logo size="small" showTagline={false} />
          </div>
          <h1 className="auth-main-title">
            {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h1>
          <p className="auth-main-subtitle">
            {mode === 'login'
              ? 'Sign in with your email and password to track orders and fast checkout.'
              : 'Join MadurFresh for 100% antibiotic-free fresh meats & swift delivery.'}
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="auth-tabs-bar">
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => switchMode('register')}
          >
            Create Account
          </button>
        </div>

        {/* Error Notification */}
        {authError && (
          <div className="auth-error-box">
            <AlertCircle size={16} className="auth-error-icon" />
            <span>{authError}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="auth-form-group">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={17} className="auth-input-icon" />
                <input
                  type="email"
                  className="auth-input"
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-form-group">
              <div className="auth-label-row">
                <label className="auth-label">Password</label>
              </div>
              <div className="auth-input-wrapper">
                <Lock size={17} className="auth-input-icon" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-auth-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="auth-switch-prompt">
              <span>Don't have an account yet?</span>
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => switchMode('register')}
              >
                Create Account
              </button>
            </div>
          </form>
        )}

        {/* REGISTRATION / CREATE ACCOUNT FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <div className="auth-form-group">
              <label className="auth-label">Full Name *</label>
              <div className="auth-input-wrapper">
                <User size={17} className="auth-input-icon" />
                <input
                  type="text"
                  className="auth-input"
                  placeholder="e.g. Rajesh Kumar"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Email Address *</label>
              <div className="auth-input-wrapper">
                <Mail size={17} className="auth-input-icon" />
                <input
                  type="email"
                  className="auth-input"
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Phone Number (Optional)</label>
              <div className="auth-input-wrapper">
                <Phone size={17} className="auth-input-icon" />
                <input
                  type="tel"
                  className="auth-input"
                  placeholder="+91 98765 43210"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Create Password *</label>
              <div className="auth-input-wrapper">
                <Lock size={17} className="auth-input-icon" />
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Min. 6 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Confirm Password *</label>
              <div className="auth-input-wrapper">
                <Lock size={17} className="auth-input-icon" />
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Re-enter password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-auth-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="auth-switch-prompt">
              <span>Already have an account?</span>
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => switchMode('login')}
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* Bottom Helpers */}
        <div className="auth-footer-actions">
          <button
            type="button"
            className="auth-back-home"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={15} />
            <span>Continue as Guest / Back to Store</span>
          </button>

          <div className="auth-admin-link" onClick={() => navigate('/admin')}>
            <ShieldCheck size={14} color="#075437" />
            <span>Store Admin Login &rarr;</span>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page-wrapper {
          min-height: calc(100vh - 120px);
          background: linear-gradient(180deg, #FAF8F2 0%, #F1F6F2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px 64px 16px;
        }

        .auth-card-container {
          background: #FFFFFF;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 440px;
          padding: 32px 28px;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .auth-brand-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .auth-logo-wrap {
          margin-bottom: 12px;
          transition: transform var(--transition-fast);
        }

        .auth-logo-wrap:hover {
          transform: scale(1.02);
        }

        .auth-main-title {
          font-size: 1.45rem;
          font-weight: 800;
          color: var(--charcoal);
          margin-bottom: 6px;
        }

        .auth-main-subtitle {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.4;
          max-width: 340px;
        }

        /* Mode Tabs */
        .auth-tabs-bar {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: var(--surface-ivory);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-pill);
          padding: 4px;
          gap: 4px;
        }

        .auth-tab-btn {
          padding: 8px 12px;
          font-size: 0.86rem;
          font-weight: 700;
          border-radius: var(--radius-pill);
          color: var(--text-muted);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .auth-tab-btn.active {
          background: #FFFFFF;
          color: var(--primary-green);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }

        /* Error Alert */
        .auth-error-box {
          background: #FFF5F5;
          border: 1px solid #FEB2B2;
          color: #C53030;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .auth-error-icon {
          flex-shrink: 0;
        }

        /* Form */
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .auth-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .auth-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .auth-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .auth-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .auth-input-icon {
          position: absolute;
          left: 12px;
          color: #94A3B8;
          pointer-events: none;
        }

        .auth-input {
          width: 100%;
          padding: 10px 38px 10px 38px;
          background: #FAFAFA;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 0.88rem;
          color: var(--charcoal);
          outline: none;
          transition: all var(--transition-fast);
        }

        .auth-input:focus {
          background: #FFFFFF;
          border-color: var(--primary-green);
          box-shadow: 0 0 0 2px rgba(7, 84, 55, 0.12);
        }

        .auth-eye-btn {
          position: absolute;
          right: 10px;
          color: #94A3B8;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .auth-eye-btn:hover {
          color: var(--charcoal);
        }

        .btn-auth-primary {
          background: var(--primary-green);
          color: #FFFFFF;
          font-size: 0.95rem;
          font-weight: 800;
          padding: 12px;
          border-radius: var(--radius-pill);
          border: none;
          cursor: pointer;
          margin-top: 6px;
          box-shadow: 0 3px 10px rgba(7, 84, 55, 0.2);
          transition: all var(--transition-fast);
        }

        .btn-auth-primary:hover {
          background: #053D27;
          transform: translateY(-1px);
        }

        .btn-auth-primary:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .auth-switch-prompt {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .auth-link-btn {
          background: transparent;
          border: none;
          color: var(--primary-green);
          font-weight: 800;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
        }

        .auth-link-btn:hover {
          color: #053D27;
        }

        /* Footer */
        .auth-footer-actions {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding-top: 14px;
          border-top: 1px solid var(--border-light);
        }

        .auth-back-home {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-muted);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color var(--transition-fast);
        }

        .auth-back-home:hover {
          color: var(--primary-green);
        }

        .auth-admin-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          font-weight: 700;
          color: #075437;
          cursor: pointer;
          background: #EFF8F4;
          padding: 4px 12px;
          border-radius: var(--radius-pill);
        }

        .auth-admin-link:hover {
          background: #D8EFE5;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
