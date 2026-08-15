import { Link } from 'react-router-dom';
import TypewriterText from '../components/TypewriterText.jsx';
import BookshelfEdge from '../components/BookshelfEdge.jsx';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">
      <BookshelfEdge side="left" />
      <BookshelfEdge side="right" />

      <svg className="doorway-frame" viewBox="0 0 600 760" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
        <path
            d="M50,760 L50,260 A250,250 0 0 1 550,260 L550,760"
            fill="none"
            stroke="var(--accent-moss)"
            strokeWidth="3"
        />
        <path
            d="M20,760 L20,270 A280,270 0 0 1 580,270 L580,760"
            fill="none"
            stroke="var(--dust-amber)"
            strokeWidth="1"
            opacity="0.5"
        />
      </svg>

      <div className="landing-glow" aria-hidden="true" />
      <div className="landing-vignette" aria-hidden="true" />

      <div className="landing-content">
        <h1 className="landing-title">Fragments</h1>
        <p className="landing-subtitle">
          <TypewriterText text="of something that has been filed by hands" />
        </p>

        <p className="landing-intro">
          Once scattered across a hundred messages with no order to speak of
          now filed, tagged, and (mostly) findable. Welcome to the archive.
        </p>

        <Link to="/archive" className="enter-button">
          Enter the Archive Room
        </Link>

        <svg className="landing-divider" viewBox="0 0 200 20" aria-hidden="true">
          <line x1="0" y1="10" x2="85" y2="10" stroke="var(--accent-gold)" strokeWidth="1" />
          <path d="M100 3 L107 10 L100 17 L93 10 Z" fill="var(--accent-gold)" />
          <line x1="115" y1="10" x2="200" y2="10" stroke="var(--accent-gold)" strokeWidth="1" />
        </svg>

        <p className="landing-credits">
          Researched &amp; compiled by <span className="credit-name">Muti</span> and{' '}
          <span className="credit-name">Sabichka</span>
          {' · '}
          Illustrated by <span className="credit-name">Petrofa</span> and{' '}
          <span className="credit-name">Colpa</span>
        </p>

      </div>
    </div>
  );
}