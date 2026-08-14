import { useState } from 'react';
import TypewriterText from '../components/TypewriterText.jsx';
import CharacterCard from '../components/CharacterCard.jsx';
import { jitterFor } from '../utils/jitter';
import characters from '../data/characters.json';
import aus from '../data/aus.json';
import posts from '../data/posts.json';
import './home.css';

export default function Home() {
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();

  const filteredCharacters = characters.filter((char) => {
    if (!normalizedQuery) return true;
    const nameMatch = char.name.toLowerCase().includes(normalizedQuery);
    const tagMatch = char.tags?.some((tag) =>
      tag.toLowerCase().includes(normalizedQuery)
    );
    return nameMatch || tagMatch;
  });

  return (
    <div className="home">
      <header className="home-header">
        <h1 className="home-title">Fragments</h1>
        <p className="home-subtitle">
        </p>

        <div className="lookup-slip">
          <label htmlFor="lookup" className="lookup-label">Lookup</label>
          <input
            id="lookup"
            type="text"
            className="lookup-input"
            placeholder="search by name or tag…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="character-grid">
        {filteredCharacters.length > 0 ? (
          filteredCharacters.map((char, i) => (
            <CharacterCard
              key={char.slug}
              character={char}
              index={i}
              rotation={jitterFor(i)}
            />
          ))
        ) : (
          <p className="no-results">No records match that search.</p>
        )}
      </div>

      <footer className="archive-stats">
        {characters.length} character{characters.length !== 1 ? 's' : ''} filed
        {' · '}
        {aus.length} folder{aus.length !== 1 ? 's' : ''}
        {' · '}
        {posts.length} entr{posts.length !== 1 ? 'ies' : 'y'} pinned
      </footer>
    </div>
  );
}