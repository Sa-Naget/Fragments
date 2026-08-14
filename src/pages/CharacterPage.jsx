import { useParams, Link } from 'react-router-dom';
import characters from '../data/characters.json';
import aus from '../data/aus.json';
import PlaceholderFrame from '../components/PlaceholderFrame.jsx';
import TypewriterText from '../components/TypewriterText';
import './CharacterPage.css';

const STAT_FIELDS = [
  { key: 'age', label: 'Age' },
  { key: 'hairColor', label: 'Hair Colour' },
  { key: 'highlight', label: 'Highlight' },
  { key: 'eyeColor', label: 'Eye Colour' },
  { key: 'height', label: 'Height' },
  { key: 'birthplace', label: 'Birthplace' },
  { key: 'currentResidence', label: 'Current Residence' },
];

export default function CharacterPage() {
  const { slug } = useParams();
  const character = characters.find((c) => c.slug === slug);

  if (!character) {
    return (
      <div className="character-page-notfound">
        <p>Hmm, it seems like Muti haven't filed this person yet.</p>
        <Link to="/">← Backtrack</Link>
      </div>
    );
  }

  const characterAUs = aus.filter((au) => character.aus.includes(au.slug));
  const hasStats = STAT_FIELDS.some(({ key }) => character[key]);

  return (
    <div className="character-page">
      <Link to="/" className="back-link">← Backtrack</Link>

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

      {character.shortBio && (
        <div className="bio-section">
          <p className="section-label">BIOGRAPHY</p>
          <p className="bio-text">{character.shortBio}</p>
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