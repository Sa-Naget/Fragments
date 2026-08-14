import './PlaceholderFrame.css';

export default function PlaceholderFrame({ label = 'Ask Petrofa' }) {
  return (
    <div className="placeholder-frame">
      <svg viewBox="0 0 100 100" className="placeholder-frame-corners" aria-hidden="true">
        <path d="M4 20 V4 H20" fill="none" stroke="var(--accent-moss)" strokeWidth="2" />
        <path d="M80 4 H96 V20" fill="none" stroke="var(--accent-moss)" strokeWidth="2" />
        <path d="M96 80 V96 H80" fill="none" stroke="var(--accent-moss)" strokeWidth="2" />
        <path d="M20 96 H4 V80" fill="none" stroke="var(--accent-moss)" strokeWidth="2" />
      </svg>
      <span className="placeholder-frame-label">{label}</span>
    </div>
  );
}