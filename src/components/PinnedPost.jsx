import { useRef } from 'react';

const MAX_TILT = 10; // degrees

export default function PinnedPost({ post, rotation, index }) {
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

    card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `rotate(${rotation}deg)`;
  };

  const preview = post.title || post.content.split('\n\n')[0];

  return (
    <div
      ref={cardRef}
      className="pinned-post"
      style={{ '--rot': `${rotation}deg`, '--i': index, transform: `rotate(${rotation}deg)` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span className="pin" aria-hidden="true" />
      <p className="pinned-post-date">{post.date}</p>
      <p className="pinned-post-content">
        {preview}
        {post.source_Link && (
          <span className="read-more-wrap">
            {' '}
            <a
              href={post.source_Link}
              target="_blank"
              rel="noopener noreferrer"
              className="read-more-link"
            >
              Read more …
            </a>
          </span>
        )}
      </p>
      <span className="pinned-post-type">{post.type}</span>
    </div>
  );
}