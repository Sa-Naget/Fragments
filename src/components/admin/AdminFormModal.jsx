import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './AdminFormModal.css';

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
  submitButtonText = 'Add',
}) {
  // Tracks the in-progress typed value for each tag-style field,
  // keyed by field name (e.g. { tags: 'bright', skills: '' })
  const [tagDrafts, setTagDrafts] = useState({});

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

  // "Edit Character" / "Edit AU" / "Edit Post" all start with "Edit" —
  // use that to drive the eyebrow label and submitting text, since
  // editingId itself isn't passed down to this component.
  const isEditing = title?.toLowerCase().startsWith('edit');

  // Fields can declare an explicit page ('left' | 'right'). If none do,
  // fall back to the old positional split (identity fields left, rest right).
  const hasExplicitPages = fields.some((f) => f.page);
  let leftFields, rightFields;
  if (hasExplicitPages) {
    leftFields = fields.filter((f) => f.page !== 'right');
    rightFields = fields.filter((f) => f.page === 'right');
  } else {
    const splitIndex = fields.length <= 4 ? 2 : 3;
    leftFields = fields.slice(0, splitIndex);
    rightFields = fields.slice(splitIndex);
  }

  const addTag = (field, rawValue) => {
    const value = rawValue.trim();
    if (!value) return;
    const current = Array.isArray(formData[field.name]) ? formData[field.name] : [];
    if (current.includes(value)) return;
    setFormData({ ...formData, [field.name]: [...current, value] });
    setTagDrafts({ ...tagDrafts, [field.name]: '' });
  };

  const removeTag = (field, valueToRemove) => {
    const current = Array.isArray(formData[field.name]) ? formData[field.name] : [];
    setFormData({ ...formData, [field.name]: current.filter((v) => v !== valueToRemove) });
  };

  const handleTagKeyDown = (field, e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(field, tagDrafts[field.name] || '');
    } else if (e.key === 'Backspace' && !tagDrafts[field.name]) {
      // Backspace on an empty input removes the last chip
      const current = Array.isArray(formData[field.name]) ? formData[field.name] : [];
      if (current.length > 0) removeTag(field, current[current.length - 1]);
    }
  };

  const toggleAu = (field, auId) => {
    const current = Array.isArray(formData[field.name]) ? formData[field.name] : [];
    const next = current.includes(auId)
      ? current.filter((id) => id !== auId)
      : [...current, auId];
    setFormData({ ...formData, [field.name]: next });
  };

  const renderField = (field) => {
    if (field.type === 'textarea') {
      return (
        <label key={field.name} className="book-field">
          <span>{field.label}</span>
          <textarea
            value={formData[field.name] || ''}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            placeholder={field.placeholder || ''}
          />
        </label>
      );
    }

    if (field.type === 'tags') {
      const chips = Array.isArray(formData[field.name]) ? formData[field.name] : [];
      return (
        <label key={field.name} className="book-field">
          <span>{field.label}</span>
          <div className="book-tags">
            {chips.map((chip) => (
              <span className="book-tag-chip" key={chip}>
                {chip}
                <button type="button" onClick={() => removeTag(field, chip)} aria-label={`Remove ${chip}`}>
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagDrafts[field.name] || ''}
              onChange={(e) => setTagDrafts({ ...tagDrafts, [field.name]: e.target.value })}
              onKeyDown={(e) => handleTagKeyDown(field, e)}
              onBlur={() => addTag(field, tagDrafts[field.name] || '')}
              placeholder={field.placeholder || 'Type and press Enter…'}
            />
          </div>
        </label>
      );
    }

    if (field.type === 'auChecklist') {
      const selected = Array.isArray(formData[field.name]) ? formData[field.name] : [];
      const options = field.options || [];
      return (
        <label key={field.name} className="book-field">
          <span>{field.label}</span>
          <div className="book-au-checklist">
            {options.length === 0 ? (
              <p className="book-au-checklist-empty">No AUs yet</p>
            ) : (
              options.map((au) => (
                <label key={au.id}>
                  <input
                    type="checkbox"
                    checked={selected.includes(au.id)}
                    onChange={() => toggleAu(field, au.id)}
                  />
                  {au.title}
                </label>
              ))
            )}
          </div>
        </label>
      );
    }

    if (field.type === 'select') {
      return (
        <label key={field.name} className="book-field">
          <span>{field.label}</span>
          <select
            value={formData[field.name] || ''}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
          >
            <option value="">Select...</option>
            {field.options?.map((opt) => {
              const optValue = typeof opt === 'object' ? opt.value : opt;
              const optLabel = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={optValue} value={optValue}>{optLabel}</option>
              );
            })}
          </select>
        </label>
      );
    }

    return (
      <label key={field.name} className="book-field">
        <span>{field.label}</span>
        <input
          type={field.type || 'text'}
          value={formData[field.name] || ''}
          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
          placeholder={field.placeholder || ''}
        />
      </label>
    );
  };

  const modal = (
    <div className="book-modal-overlay" onClick={handleOverlayClick}>
      <form onSubmit={onSubmit} className="book-modal-cover">
        <button
          type="button"
          className="book-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="book-modal-pages">
          {/* Left page */}
          <div className="book-page book-page--left">
            <p className="book-eyebrow">{isEditing ? 'Edit record' : 'Add record'}</p>
            <h2 className="book-title">{title}</h2>
            <div className="book-title-rule" />
            {leftFields.map(renderField)}
          </div>

          {/* Right page */}
          <div className="book-page book-page--right">
            {rightFields.map(renderField)}

            {error && <p className="book-error">{error}</p>}

            <button type="submit" className="book-submit" disabled={isSubmitting}>
              {isSubmitting ? (isEditing ? 'Updating…' : 'Adding…') : submitButtonText}
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  return createPortal(modal, document.body);
}