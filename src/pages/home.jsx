import { useState, useEffect } from 'react';
import TypewriterText from '../components/TypewriterText.jsx';
import CharacterCard from '../components/CharacterCard.jsx';
import { jitterFor } from '../utils/jitter';
import { supabase } from '../lib/supabaseClient';
import './home.css';

export default function Home() {
  const [query, setQuery] = useState('');
  const [characters, setCharacters] = useState([]);
  const [stats, setStats] = useState({ characters: 0, aus: 0, posts: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      const [charactersResult, ausResult, postsResult] = await Promise.all([
        supabase.from('characters').select('*').order('created_at'),
        supabase.from('aus').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
      ]);

      if (charactersResult.error) {
        setError(charactersResult.error.message);
        setLoading(false);
        return;
      }

      setCharacters(charactersResult.data);
      setStats({
        characters: charactersResult.data.length,
        aus: ausResult.count ?? 0,
        posts: postsResult.count ?? 0,
      });
      setLoading(false);
    }

    loadData();
  }, []);

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
        <h1 className="home-title"><TypewriterText text="Welcome to Archiva" /> </h1>

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

      {loading && <p className="loading-message">Retrieving records from Muti ...</p>}

      {error && <p className="error-message">I'm sorry, it seems like I can't reach the archive. Ask Sabichka about " {error} "</p>}

      {!loading && !error && (
        <>
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
            {stats.characters} character{stats.characters !== 1 ? 's' : ''} filed
            {' · '}
            {stats.aus} folder{stats.aus !== 1 ? 's' : ''}
            {' · '}
            {stats.posts} entr{stats.posts !== 1 ? 'ies' : 'y'} pinned
          </footer>
        </>
      )}
    </div>
  );
}