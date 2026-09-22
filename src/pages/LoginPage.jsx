import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { login } from '../api/authApi';
import { setAuth } from '../utils/authStorage';
import Seo from '../seo/Seo';
import './LoginPage.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const emailRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // بعد از لاگین کاربر به کجا برگرده (اگه از ProtectedRoute هدایت شده)
  const from = useMemo(
    () => location.state?.from?.pathname || '/app',
    [location.state]
  );

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const emailError = touched.email && !EMAIL_RE.test(email)
    ? t('loginPage.errors.emailInvalid')
    : '';
  const passwordError = touched.password && password.length < 6
    ? t('loginPage.errors.passwordShort')
    : '';

  const isValid = EMAIL_RE.test(email) && password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setError('');

    if (!isValid || loading) return;

    setLoading(true);
    try {
      const data = await login(email, password, { remember });
      setAuth(data.token, data.user, { remember });
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        t('loginPage.errors.generic');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo
        title={t('login')}
        description={t('footer.tagline')}
        path="/login"
        noindex
      />

      <div className="ez-login-page">
        <form
          className="ez-login-card"
          onSubmit={handleSubmit}
          noValidate
          aria-busy={loading}
        >
          <header className="ez-login-header">
            <h1 className="ez-login-title">{t('login')}</h1>
            <p className="ez-login-subtitle">{t('loginPage.subtitle')}</p>
          </header>

          {/* Email */}
          <label className="ez-login-field">
            <span className="ez-login-label">{t('email')}</span>
            <span className="ez-login-input-wrap">
              <Mail size={16} className="ez-login-input-icon" aria-hidden="true" />
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((s) => ({ ...s, email: true }))}
                required
                autoComplete="email"
                placeholder={t('loginPage.placeholders.email')}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? 'login-email-error' : undefined}
                dir="ltr"
                disabled={loading}
              />
            </span>
            {emailError && (
              <span id="login-email-error" className="ez-login-field-error">
                {emailError}
              </span>
            )}
          </label>

          {/* Password */}
          <label className="ez-login-field">
            <span className="ez-login-label">{t('password')}</span>
            <span className="ez-login-input-wrap">
              <Lock size={16} className="ez-login-input-icon" aria-hidden="true" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((s) => ({ ...s, password: true }))}
                required
                minLength={6}
                autoComplete="current-password"
                placeholder={t('loginPage.placeholders.password')}
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? 'login-password-error' : undefined}
                dir="ltr"
                disabled={loading}
              />
              <button
                type="button"
                className="ez-login-eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={
                  showPassword
                    ? t('loginPage.hidePassword')
                    : t('loginPage.showPassword')
                }
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
            {passwordError && (
              <span id="login-password-error" className="ez-login-field-error">
                {passwordError}
              </span>
            )}
          </label>

          {/* Remember + Forgot */}
          <div className="ez-login-row">
            <label className="ez-login-check">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={loading}
              />
              <span>{t('loginPage.remember')}</span>
            </label>
            <Link to="/forgot-password" className="ez-login-link">
              {t('loginPage.forgot')}
            </Link>
          </div>

          {/* Error */}
          {error && (
            <p className="ez-login-error" role="alert">
              <AlertCircle size={16} aria-hidden="true" />
              <span>{error}</span>
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="ez-login-submit"
            disabled={loading || !isValid}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="ez-spin" aria-hidden="true" />
                {t('loginPage.signingIn')}
              </>
            ) : (
              t('submit')
            )}
          </button>

          <p className="ez-login-footer">
            {t('loginPage.noAccount')}{' '}
            <Link to="/contact" className="ez-login-link">
              {t('loginPage.requestAccess')}
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default LoginPage;
