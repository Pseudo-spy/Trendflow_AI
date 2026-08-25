import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { GlowButton } from '../ui/GlowButton';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('planner@trendflow.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setValidationError('Please enter your email.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setValidationError('Please enter a valid email address.');
      return false;
    }
    if (!password) {
      setValidationError('Please enter your password.');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password, rememberMe });
      navigate('/dashboard');
    } catch (err: any) {
      setValidationError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        width: '100%',
        maxWidth: '440px',
        padding: '36px 32px',
        borderRadius: '20px',
        background: isLight ? '#FFFFFF' : '#080E0A',
        border: isLight ? '1px solid #D1FAE5' : '1px solid #183324',
        boxShadow: isLight
          ? '0 20px 50px rgba(5, 150, 105, 0.12)'
          : '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 30px rgba(16, 185, 129, 0.18)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Badge variant="emerald">ENTERPRISE ACCESS</Badge>
          <span style={{ fontSize: '11px', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <ShieldCheck size={13} /> SCM Portal
          </span>
        </div>
        <h2
          style={{
            fontSize: '26px',
            fontWeight: 800,
            color: isLight ? '#064E3B' : '#F0FDF4',
            letterSpacing: '-0.025em',
            marginBottom: '6px',
          }}
        >
          Welcome back
        </h2>
        <p style={{ fontSize: '13px', color: isLight ? '#047857' : '#86A795', lineHeight: '1.4' }}>
          Sign in to your TrendFlow AI Supply Chain Control Tower
        </p>
      </div>

      {/* Error Alert */}
      <AnimatePresence>
        {validationError && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#180709',
              border: '1px solid #4D161E',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#F87171',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            <AlertCircle size={15} color="#EF4444" style={{ flexShrink: 0 }} />
            <span>{validationError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Email Field */}
        <div>
          <label
            htmlFor="login-email"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              color: isLight ? '#064E3B' : '#F0FDF4',
              marginBottom: '6px',
            }}
          >
            <Mail size={13} color="#16A34A" />
            <span>Business Email</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="planner@trendflow.ai"
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                background: isLight ? '#FFFFFF' : '#040705',
                border: isLight ? '1px solid #D1FAE5' : '1px solid #162E20',
                color: isLight ? '#064E3B' : '#F0FDF4',
                fontSize: '13px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label
              htmlFor="login-password"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 700,
                color: isLight ? '#064E3B' : '#F0FDF4',
              }}
            >
              <Lock size={13} color="#16A34A" />
              <span>Password</span>
            </label>
            <a
              href="#forgot-password"
              onClick={(e) => {
                e.preventDefault();
                alert('For security, password resets are handled via your corporate SCM Identity Provider.');
              }}
              style={{
                fontSize: '11px',
                color: '#16A34A',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Forgot password?
            </a>
          </div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="••••••••••••"
              style={{
                width: '100%',
                padding: '11px 40px 11px 14px',
                borderRadius: '10px',
                background: isLight ? '#FFFFFF' : '#040705',
                border: isLight ? '1px solid #D1FAE5' : '1px solid #162E20',
                color: isLight ? '#064E3B' : '#F0FDF4',
                fontSize: '13px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                background: 'transparent',
                border: 'none',
                color: '#86A795',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
              }}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{
              width: '15px',
              height: '15px',
              accentColor: '#16A34A',
              cursor: 'pointer',
            }}
          />
          <label
            htmlFor="remember-me"
            style={{
              fontSize: '12px',
              color: isLight ? '#047857' : '#86A795',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            Remember me on this browser
          </label>
        </div>

        {/* Primary Submit Button */}
        <div style={{ marginTop: '8px' }}>
          <GlowButton
            variant="primary"
            size="lg"
            type="submit"
            icon={<ArrowRight size={16} />}
            iconPosition="right"
            glow
            loading={isSubmitting}
            style={{
              width: '100%',
              fontWeight: 800,
              letterSpacing: '0.03em',
              height: '46px',
            }}
          >
            {isSubmitting ? 'AUTHENTICATING...' : 'LOGIN TO CONTROL TOWER'}
          </GlowButton>
        </div>
      </form>

      {/* Explore Platform Link */}
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <NavLink
          to="/home"
          style={{
            fontSize: '12px',
            color: '#16A34A',
            textDecoration: 'none',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>Explore Platform Overview (Landing Page)</span>
          <ArrowRight size={13} />
        </NavLink>
      </div>
    </motion.div>
  );
};

export default LoginForm;
