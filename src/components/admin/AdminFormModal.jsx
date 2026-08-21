import { useEffect } from 'react';

export default function AdminFormModal({ 
  isOpen, 
  onClose, 
  title, 
  fields, 
  formData, 
  setFormData, 
  onSubmit, 
  isSubmitting, 
  error,
  submitButtonText = 'Add'
}) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          background: 'var(--surface)',
          padding: '2rem',
          borderRadius: '4px',
          width: '100%',
          maxWidth: '340px',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-label)',
          fontSize: '0.7rem',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          opacity: '0.6',
          textAlign: 'center',
          margin: '0 0 1rem',
        }}>
          Add record
        </p>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.8rem',
          textAlign: 'center',
          margin: '0 0 1.5rem',
          fontWeight: '600',
        }}>
          {title}
        </h2>

        {/* Dynamic fields */}
        {fields.map((field) => (
          <label
            key={field.name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <span style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              opacity: '0.65',
            }}>
              {field.label}
            </span>
            {field.type === 'select' ? (
              <select
                value={formData[field.name] || ''}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                style={{
                  padding: '0.75rem',
                  border: 'none',
                  borderBottom: '1px solid var(--text-on-dark)',
                  background: 'transparent',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  color: 'var(--text-on-light)',
                }}
              >
                <option value="">Select...</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || 'text'}
                value={formData[field.name] || ''}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                placeholder={field.placeholder || ''}
                style={{
                  padding: '0.75rem',
                  border: 'none',
                  borderBottom: '1px solid var(--text-on-dark)',
                  background: 'transparent',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  color: 'var(--text-on-light)',
                }}
              />
            )}
          </label>
        ))}

        {error && (
          <p style={{
            fontFamily: 'var(--font-label)',
            fontSize: '0.75rem',
            color: '#c55',
            textAlign: 'center',
            margin: '1rem 0',
          }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            marginTop: '1.5rem',
            background: 'transparent',
            color: 'var(--text-on-dark)',
            border: '1px solid var(--text-on-dark)',
            padding: '0.75rem',
            borderRadius: '2px',
            fontSize: '0.95rem',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            opacity: isSubmitting ? '0.6' : '1',
          }}
        >
          {isSubmitting ? 'Adding…' : submitButtonText}
        </button>
      </form>
    </div>
  );
}