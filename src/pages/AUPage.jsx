import { useParams, Link } from 'react-router-dom';
import aus from '../data/aus.json';
import { jitterFor } from '../utils/jitter';
import Typewriter from '../components/TypewriterText.jsx';
import characters from '../data/characters.json';
import posts from '../data/posts.json';
import PinnedPost from '../components/PinnedPost';
import './AUPage.css';

export default function AUPage() {
  const { slug } = useParams();
  const au = aus.find((a) => a.slug === slug);

  if (!au) {
    return (
      <div className="au-page-notfound">
        <p>This folder doesn't seem to exist in the archive.</p>
        <Link to="/">← Backtrack</Link>
      </div>
    );
  }

  const auCharacters = characters.filter((c) => au.characterIds.includes(c.slug));
  const auPosts = posts.filter((p) => p.auId === au.slug);

  return (
    <div className="au-page">
      <Link to="/" className="back-link">← Backtrack</Link>

      <header className="au-header">
        <p className="au-label"><Typewriter text="FOLDER" /></p>
        <h1 className="au-title">{au.title}</h1>
        <p className="au-description">{au.description}</p>

        {auCharacters.length > 0 && (
          <div className="au-characters">
            {auCharacters.map((c) => (
              <Link key={c.slug} to={`/character/${c.slug}`} className="au-character-chip">
                {c.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="corkboard">
        {auPosts.length > 0 ? (
          auPosts.map((post, i) => (
            <PinnedPost key={post.id} post={post} rotation={jitterFor(i)} index={i} />
          ))
        ) : (
          <p className="corkboard-empty">Nothing pinned here yet.</p>
        )}
      </div>
    </div>
  );
}