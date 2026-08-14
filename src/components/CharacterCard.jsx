import { useRef } from 'react';
import { Link } from 'react-router-dom';
import PlaceholderFrame from './PlaceholderFrame.jsx';

const MAX_TILT = 10; // degrees

const RECORD_FIELDS = [
  { key: 'generation', label: 'Generation' },
  { key: 'fateNumber', label: 'Fate Number' },
  { key: 'familyName', label: 'Family Name' },
  { key: 'branding', label: 'Branding' },
];

export default function CharacterCard({ character, index, rotation }) {
  const cardRef = useRef(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleMouseMove = (e) => {
    if (prefersReducedMotion) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -MAX_TILT;
    const tiltY = ((x - centerX) / centerX) * MAX_TILT;

    card.style.transform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `rotate(${rotation}deg)`;
  };

  return (
    <Link
      ref={cardRef}
      to={`/character/${character.slug}`}
      className="character-card"
      style={{ '--i': index, '--rot': `${rotation}deg`, transform: `rotate(${rotation}deg)` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span className="pin" aria-hidden="true" />
      <p className="catalog-number">No. {String(index + 1).padStart(3, '0')}</p>

      <div className="character-card-avatar">
        {character.avatar ? (
          <img src={character.avatar} alt={character.name} />
        ) : (
          <PlaceholderFrame />
        )}
      </div>

      <h2 className="character-card-name">{character.name}</h2>

      <dl className="record-fields">
        {RECORD_FIELDS.map(({ key, label }) =>
          character[key] ? (
            <div className="record-field" key={key}>
              <dt className="record-field-label">{label}</dt>
              <span className="record-field-dots" aria-hidden="true" />
              <dd className="record-field-value">{character[key]}</dd>
            </div>
          ) : null
        )}
      </dl>

      <span className="filed-stamp">FILED</span>
    </Link>
  );
}