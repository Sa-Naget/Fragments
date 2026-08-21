import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminFormModal from './AdminFormModal';

export default function AUTab() {
  const [aus, setAus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const loadAUs = async () => {
  const { data, error } = await supabase
    .from('aus')
    .select('*')
    .order('created_at');

  if (error) {
    setError(error.message);
  } else {
    setAus(data || []);
  }
  setLoading(false);
};

useEffect(() => {
  const loadInitialAUs = async () => {
    await Promise.resolve();
    await loadAUs();
  };

  loadInitialAUs();
}, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({});
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (au) => {
    setEditingId(au.id);
    setFormData(au);
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
          .from('aus')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('aus')
          .insert([formData]);

        if (error) throw error;
      }

      await loadAUs();
      closeModal();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this AU? This cannot be undone.')) return;

    const { error } = await supabase
      .from('aus')
      .delete()
      .eq('id', id);

    if (error) {
      setError(error.message);
    } else {
      await loadAUs();
    }
  };

  if (loading) {
    return <p>Loading AUs…</p>;
  }

  if (error) {
    return <p style={{ color: '#c55' }}>Error: {error}</p>;
  }

  const auFields = [
    { name: 'title', label: 'Title', placeholder: 'AU title' },
    { name: 'slug', label: 'Slug', placeholder: 'au-slug' },
    { name: 'description', label: 'Description', placeholder: 'Brief description' },
    { name: 'cover_image', label: 'Cover Image URL', placeholder: 'https://...' },
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

      {aus.length > 0 ? (
        <div style={{ border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 2fr auto',
            gap: '1rem',
            padding: '1rem',
            background: 'var(--surface-1)',
            borderBottom: '1px solid var(--border)',
            fontSize: '0.85rem',
            fontWeight: '500',
            opacity: '0.6',
          }}>
            <div>Title</div>
            <div>Slug</div>
            <div>Description</div>
            <div>Actions</div>
          </div>

          {aus.map((au) => (
            <div
              key={au.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 2fr auto',
                gap: '1rem',
                padding: '1rem',
                borderBottom: '1px solid var(--border)',
                alignItems: 'center',
              }}
            >
              <div>
                <p style={{ margin: '0', fontWeight: '500' }}>{au.title}</p>
              </div>

              <div style={{ fontSize: '0.9rem', opacity: '0.7' }}>{au.slug}</div>

              <div style={{ fontSize: '0.9rem', opacity: '0.7' }}>
                {au.description ? au.description.substring(0, 50) + '...' : '—'}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => openEditModal(au)}
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
                  onClick={() => handleDelete(au.id)}
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
        <p style={{ opacity: '0.6', fontStyle: 'italic' }}>No AUs yet. Click the + button to add one.</p>
      )}

      <AdminFormModal
        isOpen={showModal}
        onClose={closeModal}
        title={editingId ? 'Edit AU' : 'New AU'}
        fields={auFields}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isSubmitting={submitting}
        error={formError}
        submitButtonText={editingId ? 'Update' : 'Add AU'}
      />
    </div>
  );
}