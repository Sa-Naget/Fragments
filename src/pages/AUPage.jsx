import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import PinnedPost from '../components/PinnedPost';
import { jitterFor } from '../utils/jitter';
import './AUPage.css';

export default function AUPage() {
  const { slug } = useParams();
  const [au, setAu] = useState(null);
  const [auCharacters, setAuCharacters] = useState([]);
  const [auPosts, setAuPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAU() {
      setLoading(true);

      const auResult = await supabase
        .from('aus')
        .select('*, character_aus(characters(*))')
        .eq('slug', slug)
        .maybeSingle();

      if (auResult.error) {
        setError(auResult.error.message);
        setLoading(false);
        return;
      }

      if (!auResult.data) {
        setAu(null);
        setLoading(false);
        return;
      }

      setAu(auResult.data);
      setAuCharacters(auResult.data.character_aus.map((rel) => rel.characters));

      const postsResult = await supabase
        .from('posts')
        .select('*')
        .eq('au_id', auResult.data.id)
        .order('date');

      if (postsResult.error) {
        setError(postsResult.error.message);
        setLoading(false);
        return;
      }

      setAuPosts(postsResult.data);
      setLoading(false);
    }

    loadAU();
  }, [slug]);

  if (loading) {
    return <p className="loading-message">Retrieving folder…</p>;
  }

  if (error) {
    return <p className="error-message">The archive couldn't be reached: {error}</p>;
  }

  if (!au) {
    return (
      <div className="au-page-notfound">
        <p>This folder doesn't seem to exist in the archive.</p>
        <Link to="/archive">← Backtrack</Link>
      </div>
    );
  }

  return (
    <div className="au-page">
      <Link to="/archive" className="back-link">← Backtrack</Link>

      <header className="au-header">
        <p className="au-label">FOLDER</p>
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