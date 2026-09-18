import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminFormModal from './AdminFormModal';

export default function CharacterTab() {
  const [characters, setCharacters] = useState([]);
  const [aus, setAus] = useState([]);
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

  const loadAUs = async () => {
    const { data } = await supabase
      .from('aus')
      .select('id, title');

    setAus(data || []);
  };

  // Fetch characters and AUs on mount
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.resolve();
      await Promise.all([loadCharacters(), loadAUs()]);
    };

    loadInitialData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ au_ids: [] });
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = async (character) => {
    setEditingId(character.id);
    setFormError(null);

    // Fetch this character's existing AU assignments so the checklist
    // pre-checks the right boxes.
    const { data: links } = await supabase
      .from('character_aus')
      .select('au_id')
      .eq('character_id', character.id);

    setFormData({ ...character, au_ids: (links || []).map((l) => l.au_id) });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
    setEditingId(null);
    setFormError(null);
  };

  // Sync the character_aus junction table: clear existing links for this
  // character, then insert whatever's currently checked. Simplest way to
  // handle a many-to-many diff without tracking individual adds/removes.
  const syncCharacterAUs = async (characterId, auIds) => {
    const { error: deleteError } = await supabase
      .from('character_aus')
      .delete()
      .eq('character_id', characterId);

    if (deleteError) throw deleteError;

    if (auIds.length > 0) {
      const rows = auIds.map((auId) => ({ character_id: characterId, au_id: auId }));
      const { error: insertError } = await supabase
        .from('character_aus')
        .insert(rows);

      if (insertError) throw insertError;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    // au_ids isn't a real column on `characters` — it drives the
    // character_aus junction table separately.
    const { au_ids, ...characterPayload } = formData;
    const selectedAuIds = au_ids || [];

    let characterId = editingId;

    try {
      if (editingId) {
        const { error } = await supabase
          .from('characters')
          .update(characterPayload)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('characters')
          .insert([characterPayload])
          .select()
          .single();

        if (error) throw error;
        characterId = data.id;
      }
    } catch (err) {
      setFormError(err.message);
      setSubmitting(false);
      return;
    }

    // Character row is saved at this point. Now sync the AU links —
    // if this part fails, say so clearly rather than losing the fact
    // that the character itself did save.
    try {
      await syncCharacterAUs(characterId, selectedAuIds);
    } catch (err) {
      setFormError(`Character saved, but AU assignments failed to save: ${err.message}`);
      setSubmitting(false);
      await loadCharacters();
      return;
    }

    await loadCharacters();
    setSubmitting(false);
    closeModal();
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
    // Left page — identity & core record fields
    { name: 'name', label: 'Name', placeholder: 'Full name', page: 'left' },
    { name: 'slug', label: 'Slug', placeholder: 'character-slug', page: 'left' },
    { name: 'avatar', label: 'Avatar URL', placeholder: 'https://...', page: 'left' },
    { name: 'generation', label: 'Generation', page: 'left' },
    { name: 'status', label: 'Status', type: 'select', options: ['Alive', 'Death'], page: 'left' },
    { name: 'family_name', label: 'Family Name', page: 'left' },
    { name: 'branding', label: 'Branding', page: 'left' },
    { name: 'fate_number', label: 'Fate Number', placeholder: '181219-0110', page: 'left' },
    { name: 'age', label: 'Age', page: 'left' },
    { name: 'birthplace', label: 'Birthplace', page: 'left' },

    // Right page — vitals, tags/skills/tools, bio, AU assignment
    { name: 'current_residence', label: 'Current Residence', page: 'right' },
    { name: 'hair_color', label: 'Hair Colour', page: 'right' },
    { name: 'highlight', label: 'Highlight', page: 'right' },
    { name: 'eye_color', label: 'Eye Colour', page: 'right' },
    { name: 'height', label: 'Height', placeholder: '184 cm', page: 'right' },
    { name: 'tags', label: 'Tags', type: 'tags', placeholder: 'Type and press Enter…', page: 'right' },
    { name: 'skills', label: 'Skills / Abilities', type: 'tags', placeholder: 'Type and press Enter…', page: 'right' },
    { name: 'tools', label: 'Tools', type: 'tags', placeholder: 'Type and press Enter…', page: 'right' },
    { name: 'short_bio', label: 'Biography', placeholder: 'Short biography', type: 'textarea', page: 'right' },
    { name: 'au_ids', label: 'Filed Under (AUs)', type: 'auChecklist', options: aus, page: 'right' },
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

      {/* Characters table */}
      {characters.length > 0 ? (
        <div className="admin-table-shell">
          {/* Table header */}
          <div className="admin-table-grid admin-table-grid--characters" style={{
            display: 'grid',
            gridTemplateColumns: '60px 2fr 1fr 1fr auto',
            gap: '1rem',
            padding: '1rem',
            background: 'var(--surface-muted)',
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
                background: 'var(--surface-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                opacity: '0.5',
                overflow: 'hidden',
              }}>
                {char.avatar ? (
                  <img src={char.avatar} alt={char.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  'Image'
                )}
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
                    color: 'var(--text-on-dark)',
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