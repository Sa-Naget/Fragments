import { useMemo } from 'react';
import './BookshelfEdge.css';

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export default function BookshelfEdge({ side = 'left' }) {
  const books = useMemo(() => {
    const list = [];
    let y = 0;
    let id = 0;
    while (y < 700) {
      const height = randomBetween(28, 60);
      list.push({ id: id++, y, height });
      y += height + 3;
    }
    return list;
  }, []);

  return (
    <div className={`bookshelf-edge bookshelf-edge--${side}`} aria-hidden="true">
      <svg viewBox="0 0 90 700" preserveAspectRatio="none">
        {books.map((b) => (
          <rect
            key={b.id}
            x="10"
            y={b.y}
            width="70"
            height={b.height}
            rx="1"
            fill={b.id % 2 === 0 ? 'var(--ink)' : 'var(--accent-moss)'}
          />
        ))}
      </svg>
    </div>
  );
}