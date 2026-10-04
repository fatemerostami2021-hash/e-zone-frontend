import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send, ExternalLink } from 'lucide-react';
import './ContactPage.css';

const EMAIL = 'info@ezone.ir';
const PHONE = '+98 21 0000 0000';
const MAP_QUERY = encodeURIComponent('Tehran, Iran');

const EMPTY = { name: '', email: '', company: '', phone: '', message: '' };

/**
 * Parallax on the hero:
 *  - writes --mx / --my (0..1) into the hero element
 *  - CSS uses those to move image + text at different depths
 *  - disables itself on touch / reduced-motion
 */
function useHeroParallax(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reduce || !fine) return undefined;

    let raf = 0;
    let tx = 0.5;
    let ty = 0.5;
    let x = 0.5;
    let y = 0.5;

    const tick = () => {
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
      el.style.setProperty('--mx', x.toFixed(4));
      el.style.setProperty('--my', y.toFixed(4));
      if (Math.abs(tx - x) > 0.0005 || Math.abs(ty - y) > 0.0005) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width;
      ty = (e.clientY - r.top) / r.height;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      tx = 0.5;
      ty = 0.5;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [ref]);
}

function ContactPage() {
  const { i18n } = useTranslation();
  const isFa = i18n.language?.startsWith('fa');
  const L = (fa, en) => (isFa ? fa : en);

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [opened, setOpened] = useState(false);

  const heroRef = useRef(null);
  useHeroParallax(heroRef);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim())
      er.name = L('نام و نام خانوادگی را وارد کنید', 'Enter your full name');
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      er.email = L('یک ایمیل معتبر وارد کنید', 'Enter a valid email address');
    }
    if (!form.company.trim())
      er.company = L('نام شرکت را وارد کنید', 'Enter your company name');
    return er;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;

    const subject = L(
      `درخواست تماس از ${form.company.trim()}`,
      `Contact request from ${form.company.trim()}`
    );
    const lines = [
      form.message.trim(),
      '',
      `${L('نام', 'Name')}: ${form.name.trim()}`,
      `${L('ایمیل', 'Email')}: ${form.email.trim()}`,
      `${L('شرکت', 'Company')}: ${form.company.trim()}`,
    ];
    if (form.phone.trim()) lines.push(`${L('تلفن', 'Phone')}: ${form.phone.trim()}`);
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(lines.join('\n'))}`;
    setOpened(true);
  };

  const field = (name, label, opts = {}) => (
    <label className="ezc-field">
      <span>
        {label}
        {opts.required && <b aria-hidden="true"> *</b>}
      </span>
      <input
        name={name}
        type={opts.type || 'text'}
        dir={opts.ltr ? 'ltr' : undefined}
        value={form[name]}
        onChange={onChange}
        autoComplete={opts.autoComplete}
        aria-required={opts.required || undefined}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `ezc-err-${name}` : undefined}
      />
      {errors[name] && (
        <em id={`ezc-err-${name}`} className="ezc-err">
          {errors[name]}
        </em>
      )}
    </label>
  );

  return (
    <div className="ezc">
      {/* ============ HERO ============ */}
      <section
        ref={heroRef}
        className="ezc-hero"
        aria-labelledby="ezc-hero-title"
      >
        <div className="ezc-hero-media" aria-hidden="true">
          <div className="ezc-hero-layer ezc-hero-layer--base">
            <img
              src="/image/contact/contact-hero.webp"
              alt=""
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="ezc-hero-layer ezc-hero-layer--reveal">
            <img
              src="/image/contact/contact-hero.webp"
              alt=""
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
        <div className="ezc-hero-scrim" aria-hidden="true" />
        <div className="ezc-hero-grain" aria-hidden="true" />

        <div className="ezc-hero-inner">
          <h1 id="ezc-hero-title" className="ezc-hero-title">
            {L('ببینیم با هم چه می‌توانیم بسازیم', 'See what we can do together')}
          </h1>

          <div className="ezc-reach">
            <span className="ezc-reach-icon">
              <Send size={22} aria-hidden="true" />
            </span>
            <h2>{L('چطور با ما در تماس باشید؟', 'How can you reach us?')}</h2>
            <p>
              {L(
                'می‌توانید پیام بگذارید، ایمیل بزنید یا با شماره زیر تماس بگیرید. فرم را با اطلاعات خود پر کنید تا با شما تماس بگیریم',
                'Leave a message, email us, or call the number below. Fill in the form with your details and we will get back to you'
              )}
            </p>
            <div className="ezc-reach-links">
              <a href={`mailto:${EMAIL}`}>
                <Mail size={16} aria-hidden="true" />
                <span dir="ltr">{EMAIL}</span>
              </a>
              <a href={`tel:${PHONE.replace(/\s/g, '')}`}>
                <Phone size={16} aria-hidden="true" />
                <span dir="ltr">{PHONE}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FORM + MEDIA ============ */}
      <section className="ezc-main">
        <form className="ezc-form" onSubmit={onSubmit} noValidate>
          <h2 className="ezc-h2">{L('همین امروز پیام بدهید', 'Reach us today')}</h2>

          {field('name', L('نام و نام خانوادگی', 'Full name'), {
            required: true,
            autoComplete: 'name',
          })}
          {field('email', L('ایمیل سازمانی', 'Business email'), {
            required: true,
            type: 'email',
            ltr: true,
            autoComplete: 'email',
          })}
          {field('company', L('نام شرکت', 'Company name'), {
            required: true,
            autoComplete: 'organization',
          })}
          {field('phone', L('تلفن (اختیاری)', 'Phone (optional)'), {
            type: 'tel',
            ltr: true,
            autoComplete: 'tel',
          })}

          <label className="ezc-field">
            <span>{L('پیام شما (اختیاری)', 'Your message (optional)')}</span>
            <textarea
              name="message"
              rows={5}
              value={form.message}
              onChange={onChange}
            />
            <small>
              {L(
                'اگر سؤالی دارید، اینجا بنویسید',
                'If you have any questions, please let us know'
              )}
            </small>
          </label>

          <button
            type="submit"
            className="ez-btn-lg ez-btn-lg--primary ezc-submit"
          >
            {L('ارسال پیام', 'Send message')}
          </button>

          {opened && (
            <p className="ezc-note" role="status">
              {L(
                `برنامهٔ ایمیل شما باز شد؛ پیام را از همان‌جا ارسال کنید. اگر باز نشد، مستقیم به ${EMAIL} بنویسید`,
                `Your mail app should have opened; send the message from there. If it did not, write to ${EMAIL} directly`
              )}
            </p>
          )}

          <p className="ezc-fine">
            {L('فیلدهای ستاره‌دار الزامی‌اند', 'Required fields are marked with *')}{' '}
            {L(
              'اطلاعات حساس مانند رمز عبور یا شماره کارت را از طریق این فرم ارسال نکنید',
              'Never send sensitive information such as passwords or card numbers through this form'
            )}
          </p>
        </form>

        <div className="ezc-media">
          <img
            src="/image/contact/body-contact.webp"
            alt={L('لجستیک و انبار', 'Logistics and warehousing')}
            loading="lazy"
            decoding="async"
          />
          <span className="ezc-media-glow" aria-hidden="true" />
        </div>
      </section>

      {/* ============ LOCATION ============ */}
      <section className="ezc-loc">
        <h2 className="ezc-h2 ezc-h2--center">
          {L('موقعیت ما', 'Our location')}
        </h2>
        <p className="ezc-loc-sub">
          {L('منتظر ارتباط شما هستیم', 'We are waiting to hear from you')}
        </p>

        <div className="ezc-loc-card">
          <div className="ezc-loc-head">
            <div>
              <small>{L('ایران – تهران', 'Iran – Tehran')}</small>
              <h3>{L('ایزون', 'E-ZONE')}</h3>
              <p>
                <MapPin size={16} aria-hidden="true" />{' '}
                {L('تهران، ایران', 'Tehran, Iran')}
              </p>
            </div>
            <a
              className="ez-btn-lg ez-btn-lg--primary"
              href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {L('مشاهده در نقشه گوگل', 'See in Google Maps')}
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          </div>
          <iframe
            className="ezc-map"
            title={L('نقشه موقعیت ایزون', 'E-ZONE location map')}
            src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}

export default ContactPage;