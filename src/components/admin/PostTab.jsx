import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminFormModal from './AdminFormModal';

export default function PostTab() {
  const [posts, setPosts] = useState([]);
  const [aus, setAus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const loadPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  const loadAUs = async () => {
    const { data } = await supabase
      .from('aus')
      .select('id, title, slug');

    setAus(data || []);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.resolve();
      await Promise.all([loadPosts(), loadAUs()]);
    };

    loadInitialData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({});
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (post) => {
    setEditingId(post.id);
    setFormData(post);
    setFormError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
    setEditingId(null);
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('posts')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('posts')
          .insert([formData]);

        if (error) throw error;
      }

      await loadPosts();
      closeModal();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this post? This cannot be undone.')) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      setError(error.message);
    } else {
      await loadPosts();
    }
  };

  if (loading) {
    return <p>Loading posts…</p>;
  }

  if (error) {
    return <p style={{ color: '#c55' }}>Error: {error}</p>;
  }

  const postFields = [
    { name: 'au_id', label: 'AU', type: 'select', options: aus.map(au => au.id) },
    { name: 'type', label: 'Type', type: 'select', options: ['text', 'screenshot', 'image'] },
    { name: 'date', label: 'Date', type: 'date' },
    { name: 'title', label: 'Title (optional)', placeholder: 'Post title' },
    { name: 'content', label: 'Content', placeholder: 'Post content' },
    { name: 'source_link', label: 'Source Link (optional)', placeholder: 'https://...' },
  ];

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
      }}>
        <h3 style={{
          fontSize: '0.75rem',
          margin: '0',
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          opacity: '0.6',
        }}>
          Existing records
        </h3>
        <button
          onClick={openAddModal}
          style={{
            background: 'var(--text-on-dark)',
            color: 'var(--surface)',
            border: 'none',
            width: '32px',
            height: '32px',
            borderRadius: '2px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '500',
          }}
        >
          +
        </button>
      </div>

      {posts.length > 0 ? (
        <div className="admin-table-shell">
          <div className="admin-table-grid admin-table-grid--posts" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
            gap: '1rem',
            padding: '1rem',
            background: 'var(--surface-muted)',
            borderBottom: '1px solid var(--border)',
            fontSize: '0.85rem',
            fontWeight: '500',
            opacity: '0.6',
          }}>
            <div>Date</div>
            <div>Type</div>
            <div>Title</div>
            <div>AU</div>
            <div>Actions</div>
          </div>

          {posts.map((post) => {
            const auTitle = aus.find(au => au.id === post.au_id)?.title || 'Unknown';
            return (
              <div
                key={post.id}
                className="admin-table-grid admin-table-grid--posts"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
                  gap: '1rem',
                  padding: '1rem',
                  borderBottom: '1px solid var(--border)',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '0.9rem', opacity: '0.7' }}>{post.date || '—'}</div>
                <div style={{ fontSize: '0.9rem', opacity: '0.7' }}>{post.type}</div>
                <div style={{ fontSize: '0.9rem', opacity: '0.7' }}>{post.title || '(untitled)'}</div>
                <div style={{ fontSize: '0.9rem', opacity: '0.7' }}>{auTitle}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => openEditModal(post)}
                    style={{
                      background: 'none',
                      border: '0.5px solid var(--border)',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '2px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      color: 'var(--text-on-dark)',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    style={{
                      background: 'none',
                      border: '0.5px solid var(--border)',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '2px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      color: '#a33',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ opacity: '0.6', fontStyle: 'italic' }}>No posts yet. Click the + button to add one.</p>
      )}

      <AdminFormModal
        isOpen={showModal}
        onClose={closeModal}
        title={editingId ? 'Edit Post' : 'New Post'}
        fields={postFields}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isSubmitting={submitting}
        error={formError}
        submitButtonText={editingId ? 'Update' : 'Add Post'}
      />
    </div>
  );
}