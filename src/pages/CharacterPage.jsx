import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import PlaceholderFrame from '../components/PlaceholderFrame.jsx';
import TypewriterText from '../components/TypewriterText';
import './CharacterPage.css';

const STAT_FIELDS = [
  { key: 'age', label: 'Age' },
  { key: 'hair_color', label: 'Hair Colour' },
  { key: 'highlight', label: 'Highlight' },
  { key: 'eye_color', label: 'Eye Colour' },
  { key: 'height', label: 'Height' },
  { key: 'birthplace', label: 'Birthplace' },
  { key: 'current_residence', label: 'Current Residence' },
];

export default function CharacterPage() {
  const { slug } = useParams();
  const [character, setCharacter] = useState(null);
  const [characterAUs, setCharacterAUs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCharacter() {
      setLoading(true);
      const { data, error } = await supabase
        .from('characters')
        .select('*, character_aus(aus(*))')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setCharacter(data);
      setCharacterAUs(data ? data.character_aus.map((rel) => rel.aus) : []);
      setLoading(false);
    }

    loadCharacter();
  }, [slug]);

  if (loading) {
    return <p className="loading-message">Retrieving file…</p>;
  }

  if (error) {
    return <p className="error-message">The archive couldn't be reached: {error}</p>;
  }

  if (!character) {
    return (
      <div className="character-page-notfound">
        <p>Hmm, it seems like Muti haven't filed this person yet.</p>
        <Link to="/archive">← Backtrack</Link>
      </div>
    );
  }

  const hasStats = STAT_FIELDS.some(({ key }) => character[key]);

  return (
    <div className="character-page">
      <Link to="/archive" className="back-link">← Backtrack</Link>

      <div className="dossier">
        <div className="dossier-photo">
          {character.avatar ? (
            <img src={character.avatar} alt={character.name} />
          ) : (
            <PlaceholderFrame />
          )}
        </div>

        <div className="dossier-info">
          <p className="dossier-label"><TypewriterText text="CASE FILE" /></p>
          <h1 className="dossier-name">{character.name}</h1>
        </div>
      </div>

      {hasStats && (
        <div className="stats-section">
          <p className="section-label">VITALS</p>
          <dl className="stats-grid">
            {STAT_FIELDS.map(({ key, label }) =>
              character[key] ? (
                <div className="stat-row" key={key}>
                  <dt className="stat-label">{label}</dt>
                  <dd className="stat-value">{character[key]}</dd>
                </div>
              ) : null
            )}
          </dl>
        </div>
      )}

      {character.skills?.length > 0 && (
        <div className="chips-section">
          <p className="section-label">SKILLS / ABILITIES</p>
          <div className="chips-list">
            {character.skills.map((skill) => (
              <span key={skill} className="chip skill-chip">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {character.tools?.length > 0 && (
        <div className="chips-section">
          <p className="section-label">TOOLS</p>
          <div className="chips-list">
            {character.tools.map((tool) => (
              <span key={tool} className="chip tool-chip">{tool}</span>
            ))}
          </div>
        </div>
      )}

      {character.short_bio && (
        <div className="bio-section">
          <p className="section-label">BIOGRAPHY</p>
          <p className="bio-text">{character.short_bio}</p>
        </div>
      )}

      {character.tags?.length > 0 && (
        <div className="tags-section">
          {character.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="folders-section">
        <p className="folders-label"><TypewriterText text="FILED UNDER" /></p>
        <div className="folders-list">
          {characterAUs.length > 0 ? (
            characterAUs.map((au) => (
              <Link key={au.slug} to={`/au/${au.slug}`} className="folder-tab">
                {au.title}
              </Link>
            ))
          ) : (
            <p className="folders-empty">No folders filed yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}