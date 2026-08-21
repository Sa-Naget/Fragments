import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminFormModal from './AdminFormModal';

export default function CharacterTab() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const loadCharacters = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .order('created_at');

    if (error) {
      setError(error.message);
    } else {
      setCharacters(data || []);
    }
    setLoading(false);
  };

  // Fetch characters on mount
  useEffect(() => {
    const loadInitialCharacters = async () => {
      await Promise.resolve();
      await loadCharacters();
    };

    loadInitialCharacters();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({});
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (character) => {
    setEditingId(character.id);
    setFormData(character);
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
        // Update existing character
        const { error } = await supabase
          .from('characters')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        // Add new character
        const { error } = await supabase
          .from('characters')
          .insert([formData]);

        if (error) throw error;
      }

      await loadCharacters();
      closeModal();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this character? This cannot be undone.')) return;

    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', id);

    if (error) {
      setError(error.message);
    } else {
      await loadCharacters();
    }
  };

  if (loading) {
    return <p>Loading characters…</p>;
  }

  if (error) {
    return <p style={{ color: '#c55' }}>Error: {error}</p>;
  }

  const characterFields = [
    { name: 'name', label: 'Name', placeholder: 'Full name' },
    { name: 'slug', label: 'Slug', placeholder: 'character-slug' },
    { name: 'generation', label: 'Generation' },
    { name: 'status', label: 'Status', type: 'select', options: ['Alive', 'Death'] },
    { name: 'family_name', label: 'Family Name' },
    { name: 'branding', label: 'Branding' },
  ];

  return (
    <div>
      {/* List header with + button */}
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
            background: 'var(--text-primary)',
            color: 'var(--surface-2)',
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

      {/* Characters table */}
      {characters.length > 0 ? (
        <div className="admin-table-shell">
          {/* Table header */}
          <div className="admin-table-grid admin-table-grid--characters" style={{
            display: 'grid',
            gridTemplateColumns: '60px 2fr 1fr 1fr auto',
            gap: '1rem',
            padding: '1rem',
            background: 'var(--surface-1)',
            borderBottom: '1px solid var(--border)',
            fontSize: '0.85rem',
            fontWeight: '500',
            opacity: '0.6',
          }}>
            <div></div>
            <div>Name</div>
            <div>Slug</div>
            <div>Generation</div>
            <div>Actions</div>
          </div>

          {/* Table rows */}
          {characters.map((char) => (
            <div
              key={char.id}
              className="admin-table-grid admin-table-grid--characters"
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 2fr 1fr 1fr auto',
                gap: '1rem',
                padding: '1rem',
                borderBottom: '1px solid var(--border)',
                alignItems: 'center',
              }}
            >
              {/* Avatar placeholder */}
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '4px',
                background: 'var(--surface-1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                opacity: '0.5',
              }}>
                Image
              </div>

              {/* Name */}
              <div>
                <p style={{ margin: '0', fontWeight: '500' }}>{char.name}</p>
              </div>

              {/* Slug */}
              <div style={{ fontSize: '0.9rem', opacity: '0.7' }}>{char.slug}</div>

              {/* Generation */}
              <div style={{ fontSize: '0.9rem', opacity: '0.7' }}>{char.generation || '—'}</div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => openEditModal(char)}
                  style={{
                    background: 'none',
                    border: '0.5px solid var(--border)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '2px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(char.id)}
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
          ))}
        </div>
      ) : (
        <p style={{ opacity: '0.6', fontStyle: 'italic' }}>No characters yet. Click the + button to add one.</p>
      )}

      {/* Modal form */}
      <AdminFormModal
        isOpen={showModal}
        onClose={closeModal}
        title={editingId ? 'Edit Character' : 'New Character'}
        fields={characterFields}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isSubmitting={submitting}
        error={formError}
        submitButtonText={editingId ? 'Update' : 'Add Character'}
      />
    </div>
  );
}