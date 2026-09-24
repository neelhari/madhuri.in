import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';

export const AdminLoginPage = ({ navigate, onLoginSuccess }) => {
  const { loginAdmin, authError, isLoading, setAuthError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setAuthError('Please enter both email and password.');
      return;
    }

    const res = await loginAdmin(email, password);
    if (res.success && onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="login-box-card">
        {/* Top Header */}
        <div className="login-card-header">
          <div className="logo-center" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <Logo size="small" showTagline={false} />
          </div>
          <div className="portal-badge">
            <ShieldCheck size={14} color="#075437" />
            <span>Store Admin Portal</span>
          </div>
          <h2 className="login-title">Manager Login</h2>
          <p className="login-subtitle">
            Sign in with authorized store credentials to manage products, orders & inventory.
          </p>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="login-error-alert">
            <AlertCircle size={16} className="error-icon" />
            <span>{authError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Manager Email</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-left-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="madurfoods@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-left-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="pwd-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-admin-login"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying Credentials...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="login-footer">
          <button
            type="button"
            className="back-to-store-btn"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={14} />
            <span>Return to Storefront</span>
          </button>
        </div>
      </div>

      <style>{`
        .admin-login-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #FAF9F4 0%, #EFF5F0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .login-box-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          width: 100%;
          max-width: 420px;
          padding: 32px 28px;
          box-shadow: 0 10px 25px rgba(7, 84, 55, 0.08);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .login-card-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 8px;
        }

        .logo-center {
          margin-bottom: 6px;
        }

        .portal-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #EFF8F4;
          color: #075437;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 16px;
        }

        .login-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #1A202C;
          margin: 0;
        }

        .login-subtitle {
          font-size: 0.78rem;
          color: #718096;
          line-height: 1.4;
        }

        .login-error-alert {
          background: #FFF5F5;
          border: 1px solid #FEB2B2;
          color: #C53030;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: fadeIn 0.2s ease;
        }

        .error-icon {
          flex-shrink: 0;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #2D3748;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-left-icon {
          position: absolute;
          left: 12px;
          color: #A0AEC0;
          pointer-events: none;
        }

        .form-input {
          width: 100%;
          padding: 10px 38px 10px 36px;
          border: 1px solid #CBD5E0;
          border-radius: 8px;
          font-size: 0.88rem;
          outline: none;
          transition: all 0.15s ease;
        }

        .form-input:focus {
          border-color: #075437;
          box-shadow: 0 0 0 2px rgba(7, 84, 55, 0.12);
        }

        .pwd-toggle-btn {
          position: absolute;
          right: 10px;
          color: #A0AEC0;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pwd-toggle-btn:hover {
          color: #4A5568;
        }

        .btn-admin-login {
          background: #075437;
          color: #FFFFFF;
          font-size: 0.92rem;
          font-weight: 800;
          padding: 12px;
          border-radius: 8px;
          margin-top: 6px;
          transition: background 0.15s ease;
          box-shadow: 0 2px 6px rgba(7, 84, 55, 0.2);
        }

        .btn-admin-login:hover {
          background: #053D27;
        }

        .btn-admin-login:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-footer {
          display: flex;
          justify-content: center;
          padding-top: 10px;
          border-top: 1px solid #EDF2F7;
        }

        .back-to-store-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #718096;
          transition: color 0.15s ease;
        }

        .back-to-store-btn:hover {
          color: #075437;
        }
      `}</style>
    </div>
  );
};

export default AdminLoginPage;
