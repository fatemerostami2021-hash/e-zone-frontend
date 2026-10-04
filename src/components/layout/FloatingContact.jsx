import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MessageCircle,
  HelpCircle,
  Send,
  SendHorizontal,
  X,
  ChevronDown,
  ArrowLeft,
} from 'lucide-react';
import { Instagram, Linkedin, Facebook } from './BrandIcons';
import './FloatingContact.css';
/* ------------------------------------------------------------------
   1) Fill in your links here. An empty url hides that item.
   ------------------------------------------------------------------ */
const SOCIALS = [
  {
    id: 'telegram',
    icon: Send,
    fa: 'تلگرام',
    en: 'Telegram',
    url: 'https://t.me/fitness_mindset',
  },
  {
    id: 'instagram',
    icon: Instagram,
    fa: 'اینستاگرام',
    en: 'Instagram',
    url: 'https://www.instagram.com/f.rostamii_web',
  },
  {
    id: 'linkedin',
    icon: Linkedin,
    fa: 'لینکدین',
    en: 'LinkedIn',
    url: 'https://www.linkedin.com/in/fatemeh-rostami963/',
  },
  {
    id: 'facebook',
    icon: Facebook,
    fa: 'فیسبوک',
    en: 'Facebook',
    url: '', // e.g. https://facebook.com/your_page
  },
].filter((s) => s.url);

/* Optional: messages typed in the chat are also POSTed here (JSON).
   Leave empty to keep the chat local-only. */
const CHAT_ENDPOINT = import.meta.env.VITE_CHAT_ENDPOINT || '';

/* ------------------------------------------------------------------
   2) FAQ content (also used by the chat assistant to answer)
   ------------------------------------------------------------------ */
const FAQS = [
  {
    q_fa: 'ایزون دقیقاً چیست؟',
    q_en: 'What exactly is E-ZONE?',
    a_fa: 'E-ZONE یک پلتفرم یکپارچه برای مدیریت گمرک، تجارت خارجی و عملیات مناطق آزاد و ویژهٔ اقتصادی است؛ از واردات و صادرات تا انبار، تولید، BOM، ثبت سفارش و اظهارنامه.',
    a_en: 'E-ZONE is one integrated platform for customs, foreign trade and free/special economic zone operations, from imports and exports to warehouse, production, BOM, orders and declarations.',
  },
  {
    q_fa: 'داده‌های هر شرکت از شرکت‌های دیگر جداست؟',
    q_en: 'Is each company’s data isolated?',
    a_fa: 'بله. هر شرکت فقط داده و فایل خودش را می‌بیند و دسترسی کاربران به شرکت‌ها جداگانه کنترل می‌شود.',
    a_en: 'Yes. Each company sees only its own data and files, and user access is controlled per company.',
  },
  {
    q_fa: 'آیا تغییرات ردیابی می‌شوند؟',
    q_en: 'Are changes tracked?',
    a_fa: 'بله. رکوردهای مهم حذف نمی‌شوند و هر تغییر با نام کاربر و زمان آن ثبت می‌شود.',
    a_en: 'Yes. Important records are never hard-deleted and every change is logged with the user and time.',
  },
  {
    q_fa: 'رابط کاربری چه زبان‌هایی دارد؟',
    q_en: 'Which languages does it support?',
    a_fa: 'رابط کاملاً دوزبانه (فارسی و انگلیسی) است و تم روشن و تیره دارد.',
    a_en: 'The interface is fully bilingual (Persian and English) with light and dark themes.',
  },
  {
    q_fa: 'چطور مشاوره یا دمو بگیرم؟',
    q_en: 'How do I request a consultation or demo?',
    a_fa: 'از صفحهٔ «تماس با ما» درخواست خود را ثبت کنید یا از طریق همین دکمه با ما در ارتباط باشید.',
    a_en: 'Send a request from the Contact page, or reach us through the links in this button.',
  },
];

/* Very small keyword matcher: picks the FAQ that shares the most words. */
function findAnswer(text, isFa) {
  const tokens = text
    .toLowerCase()
    .split(/[\s،,.؟?!]+/)
    .filter((t) => t.length > 1);
  let best = null;
  let bestScore = 0;
  FAQS.forEach((f) => {
    const hay = `${f.q_fa} ${f.a_fa} ${f.q_en} ${f.a_en}`.toLowerCase();
    const score = tokens.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0);
    if (score > bestScore) {
      best = f;
      bestScore = score;
    }
  });
  return best ? (isFa ? best.a_fa : best.a_en) : null;
}

function FloatingContact() {
  const { i18n } = useTranslation();
  const isFa = i18n.language?.startsWith('fa');
  const L = (fa, en) => (isFa ? fa : en);

  const [open, setOpen] = useState(false);
  const [view, setView] = useState('menu'); // 'menu' | 'faq' | 'chat'
  const [openFaq, setOpenFaq] = useState(0);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);

  const rootRef = useRef(null);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  const close = () => {
    setOpen(false);
    setView('menu');
  };
  const toggle = () => (open ? close() : setOpen(true));

  /* Esc + click outside */
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && close();
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) close();
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open]);

  /* Keep the chat scrolled to the newest message */
  useEffect(() => {
    if (view === 'chat' && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, typing, view]);

  useEffect(() => {
    if (view === 'chat') inputRef.current?.focus();
  }, [view]);

  const pushMessage = (from, text) =>
    setMessages((m) => [...m, { id: `${Date.now()}-${m.length}`, from, text }]);

  const send = (raw) => {
    const text = raw.trim();
    if (!text) return;
    pushMessage('user', text);
    setDraft('');

    if (CHAT_ENDPOINT) {
      fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          lang: i18n.language,
          page: window.location.pathname,
        }),
      }).catch(() => {});
    }

    setTyping(true);
    setTimeout(() => {
      const answer = findAnswer(text, isFa);
      pushMessage(
        'bot',
        answer ||
          L(
            'پاسخ دقیقی پیدا نکردم. لطفاً از صفحهٔ «تماس با ما» پیام بگذارید تا تیم ما پاسخ دهد.',
            'I couldn’t find an exact answer. Please leave a message on the Contact page and our team will reply.',
          ),
      );
      setTyping(false);
    }, 550);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    send(draft);
  };

  const titles = {
    menu: L('پشتیبانی ایزون', 'E-ZONE Support'),
    faq: L('سؤالات متداول', 'FAQ'),
    chat: L('چت آنلاین', 'Online chat'),
  };

  return (
    <div className={`ezf${open ? ' is-open' : ''}`} ref={rootRef}>
      {open && (
        <section id="ezf-panel" className="ezf-panel" role="dialog" aria-label={titles[view]}>
          <header className="ezf-head">
            {view !== 'menu' && (
              <button
                type="button"
                className="ezf-back"
                onClick={() => setView('menu')}
                aria-label={L('بازگشت', 'Back')}
              >
                <ArrowLeft size={18} className="ezf-flip" />
              </button>
            )}
            <div className="ezf-head-text">
              <strong>{titles[view]}</strong>
              {view === 'menu' && <small>{L('چطور می‌توانیم کمک کنیم؟', 'How can we help?')}</small>}
            </div>
          </header>

          {/* ---------- MENU ---------- */}
          {view === 'menu' && (
            <ul className="ezf-list">
              <li>
                <button type="button" className="ezf-item" onClick={() => setView('chat')}>
                  <span className="ezf-ico ezf-ico--chat"><MessageCircle size={19} /></span>
                  <span>{L('چت آنلاین', 'Online chat')}</span>
                </button>
              </li>
              <li>
                <button type="button" className="ezf-item" onClick={() => setView('faq')}>
                  <span className="ezf-ico ezf-ico--faq"><HelpCircle size={19} /></span>
                  <span>{L('سؤالات متداول', 'FAQ')}</span>
                </button>
              </li>
              {SOCIALS.map(({ id, icon: Icon, fa, en, url }) => (
                <li key={id}>
                  <a className="ezf-item" href={url} target="_blank" rel="noopener noreferrer">
                    <span className={`ezf-ico ezf-ico--${id}`}><Icon size={19} /></span>
                    <span>{L(fa, en)}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}

          {/* ---------- FAQ ---------- */}
          {view === 'faq' && (
            <div className="ezf-body">
              {FAQS.map((f, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={f.q_en} className={`ezf-acc${isOpen ? ' is-open' : ''}`}>
                    <button
                      type="button"
                      className="ezf-acc-q"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    >
                      <span>{L(f.q_fa, f.q_en)}</span>
                      <ChevronDown size={16} />
                    </button>
                    {isOpen && <p className="ezf-acc-a">{L(f.a_fa, f.a_en)}</p>}
                  </div>
                );
              })}
              <Link to="/contact" className="ezf-link" onClick={close}>
                {L('سؤال شما اینجا نبود؟ تماس با ما', 'Didn’t find it? Contact us')}
              </Link>
            </div>
          )}

          {/* ---------- CHAT ---------- */}
          {view === 'chat' && (
            <>
              <div className="ezf-body ezf-chat" ref={bodyRef} aria-live="polite">
                <div className="ezf-msg ezf-msg--bot">
                  {L(
                    'سلام! دربارهٔ ایزون هر سؤالی دارید بپرسید.',
                    'Hi! Ask me anything about E-ZONE.',
                  )}
                </div>

                {messages.length === 0 && (
                  <div className="ezf-chips">
                    {FAQS.slice(0, 3).map((f) => (
                      <button
                        key={f.q_en}
                        type="button"
                        className="ezf-chip"
                        onClick={() => send(L(f.q_fa, f.q_en))}
                      >
                        {L(f.q_fa, f.q_en)}
                      </button>
                    ))}
                  </div>
                )}

                {messages.map((m) => (
                  <div key={m.id} className={`ezf-msg ezf-msg--${m.from}`}>
                    {m.text}
                  </div>
                ))}
                {typing && (
                  <div className="ezf-msg ezf-msg--bot ezf-typing" aria-label="…">
                    <span /><span /><span />
                  </div>
                )}
              </div>

              <form className="ezf-input" onSubmit={onSubmit}>
                <input
                  ref={inputRef}
                  dir="auto"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={L('پیام خود را بنویسید…', 'Type your message…')}
                  aria-label={L('پیام', 'Message')}
                />
                <button type="submit" disabled={!draft.trim()} aria-label={L('ارسال', 'Send')}>
                  <SendHorizontal size={18} className="ezf-flip" />
                </button>
              </form>
            </>
          )}
        </section>
      )}

    <button
  type="button"
  className="ezf-fab"
  onClick={toggle}
  aria-expanded={open}
  aria-controls="ezf-panel"
  aria-label={
    open
      ? L('بستن', 'Close')
      : L('پشتیبانی و ارتباط با ما', 'Support and contact')
  }
>
  <span className="ezf-fab-icon">
    {open ? <X size={24} /> : <MessageCircle size={24} />}
  </span>
  {!open && (
    <span className="ezf-fab-label">
      {L('پشتیبانی', 'Support')}
    </span>
  )}
</button>
    </div>
  );
}

export default FloatingContact;