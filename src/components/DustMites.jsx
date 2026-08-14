import './DustMites.css';

const MOTE_COUNT = 18;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export default function DustMotes() {
  const motes = Array.from({ length: MOTE_COUNT }, (_, i) => ({
    id: i,
    left: randomBetween(0, 100),
    size: randomBetween(2, 5),
    duration: randomBetween(14, 28),
    delay: randomBetween(0, 20),
    drift: randomBetween(-40, 40),
  }));

  return (
    <div className="dust-motes" aria-hidden="true">
      {motes.map((m) => (
        <span
          key={m.id}
          className="dust-mote"
          style={{
            left: `${m.left}%`,
            width: `${m.size}px`,
            height: `${m.size}px`,
            animationDuration: `${m.duration}s`,
            animationDelay: `${m.delay}s`,
            '--drift': `${m.drift}px`,
          }}
        />
      ))}
    </div>
  );
}