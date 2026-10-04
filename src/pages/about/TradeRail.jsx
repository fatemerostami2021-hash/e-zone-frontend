import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import { TRADE_LINKS } from '../../data/tradeLinks';
import './TradeRail.css';

function Chip({ item, newTab, hidden = false }) {
  return (
    <li>
      <a
        className="ezr-chip"
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${item.name} — ${newTab}`}
        tabIndex={hidden ? -1 : undefined}
      >
        <span className="ezr-chip-name">{item.name}</span>
        <span className="ezr-chip-host">{item.host}</span>
        <ExternalLink size={14} aria-hidden="true" />
      </a>
    </li>
  );
}

function Rail({ items, rowLabel, newTab, reverse = false }) {
  return (
    <div className="ezr-row">
      <span className="ezr-row-label">{rowLabel}</span>
      <div className={`ezr-rail${reverse ? ' is-reverse' : ''}`} dir="ltr">
        <div className="ezr-track">
          <ul className="ezr-list">
            {items.map((it) => (
              <Chip key={it.url} item={it} newTab={newTab} />
            ))}
          </ul>
          {/* Duplicate list for a seamless loop; hidden from assistive tech and tab order */}
          <ul className="ezr-list" aria-hidden="true">
            {items.map((it) => (
              <Chip key={it.url} item={it} newTab={newTab} hidden />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function TradeRail() {
  const { i18n } = useTranslation();
  const isFa = i18n.language === 'fa';
  const L = (fa, en) => (isFa ? fa : en);
  const newTab = L('باز شدن در تب جدید', 'opens in a new tab');

  return (
    <section className="ezr" aria-labelledby="ezr-title">
      <div className="ezr-sky" aria-hidden="true">
        <span className="ezr-cloud ezr-cloud--1" />
        <span className="ezr-cloud ezr-cloud--2" />
        <span className="ezr-cloud ezr-cloud--3" />
        <span className="ezr-cloud ezr-cloud--4" />
        <div className="ezr-plane">
          <span className="ezr-trail" />
          <svg width="64" height="24" viewBox="0 0 64 24" fill="currentColor">
            <path d="M2 13C2 11 6 10 14 10H40C52 10 62 11 62 13C62 15 52 16 40 16H14C6 16 2 15 2 13Z" />
            <path d="M26 11L36 2H40L34 11Z" />
            <path d="M26 15L34 22H38L33 15Z" />
            <path d="M6 11L3 4H8L12 11Z" />
          </svg>
        </div>
      </div>

      <div className="ezr-inner">
        <h2 id="ezr-title" className="ezr-title">
          {L('مراجع تجارت و گمرک در اروپا و خاورمیانه', 'Trade and customs references across Europe and the Middle East')}
        </h2>
        <p className="ezr-sub">
          {L(
            'پیوند به سازمان‌ها، بنادر و شرکت‌های شناخته‌شدهٔ حوزهٔ تجارت و لجستیک. این فهرست فقط مرجع است و به معنای همکاری یا تأیید رسمی نیست.',
            'Links to well-known organisations, ports and companies in trade and logistics. A reference list only; it does not imply a partnership or endorsement.',
          )}
        </p>
        <Rail items={TRADE_LINKS.europe} rowLabel={L('اروپا', 'Europe')} newTab={newTab} />
        <Rail items={TRADE_LINKS.middleEast} rowLabel={L('خاورمیانه', 'Middle East')} newTab={newTab} reverse />
      </div>
    </section>
  );
}

export default TradeRail;