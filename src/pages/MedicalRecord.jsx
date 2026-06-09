import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDateShort } from '../utils/notifications';
import './MedicalRecord.css';

const RECORD_TYPES = [
  { value: 'illness', label: 'Maladie', icon: '🤒', color: '#FEE2E2', iconBg: '#EF4444' },
  { value: 'surgery', label: 'Chirurgie', icon: '🔪', color: '#EDE9FE', iconBg: '#7C3AED' },
  { value: 'consultation', label: 'Consultation', icon: '👨‍⚕️', color: '#DBEAFE', iconBg: '#2563EB' },
  { value: 'allergy', label: 'Allergie', icon: '🌿', color: '#D1FAE5', iconBg: '#059669' },
  { value: 'other', label: 'Autre', icon: '📋', color: '#F1F5F9', iconBg: '#64748B' },
];

function RecordModal({ petId, record, onClose }) {
  const { addMedical, updateMedical } = useApp();
  const isEdit = Boolean(record);

  const [form, setForm] = useState({
    petId,
    type: record?.type || 'illness',
    title: record?.title || '',
    date: record?.date || new Date().toISOString().split('T')[0],
    endDate: record?.endDate || '',
    description: record?.description || '',
    treatment: record?.treatment || '',
    veterinarian: record?.veterinarian || '',
    resolved: record?.resolved || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (isEdit) updateMedical(record.id, form);
    else addMedical(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Modifier le dossier' : 'Nouveau dossier'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Type</label>
            <div className="type-selector-wrap">
              {RECORD_TYPES.map((t) => (
                <button
                  key={t.value} type="button"
                  className={`type-chip ${form.type === t.value ? 'active' : ''}`}
                  onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                  style={form.type === t.value ? { background: t.color, borderColor: t.iconBg } : {}}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Titre *</label>
            <input name="title" value={form.title} onChange={handleChange}
              className="form-control" placeholder="Ex: Otite, Fracture, Bilan annuel..." required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date de début</label>
              <input type="date" name="date" value={form.date}
                onChange={handleChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Date de fin</label>
              <input type="date" name="endDate" value={form.endDate}
                onChange={handleChange} className="form-control" />
            </div>
          </div>
          <div className="form-group">
            <label>Description / Symptômes</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              className="form-control" rows={3}
              placeholder="Décrivez les symptômes, le diagnostic..." />
          </div>
          <div className="form-group">
            <label>Traitement prescrit</label>
            <textarea name="treatment" value={form.treatment} onChange={handleChange}
              className="form-control" rows={2}
              placeholder="Médicaments, posologie, soins..." />
          </div>
          <div className="form-group">
            <label>Vétérinaire</label>
            <input name="veterinarian" value={form.veterinarian} onChange={handleChange}
              className="form-control" placeholder="Nom du vétérinaire ou clinique" />
          </div>
          <div className="checkbox-row">
            <input type="checkbox" name="resolved" id="resolved"
              checked={form.resolved} onChange={handleChange} />
            <label htmlFor="resolved">Problème résolu / Guérison</label>
          </div>
          <button type="submit" className="btn-primary">
            {isEdit ? '✅ Enregistrer' : '➕ Ajouter'}
          </button>
        </form>
      </div>
    </div>
  );
}

function RecordCard({ record, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const typeInfo = RECORD_TYPES.find((t) => t.value === record.type) || RECORD_TYPES[4];

  return (
    <div className="record-card" onClick={() => setExpanded((e) => !e)}>
      <div
        className="record-icon-wrap"
        style={{ background: typeInfo.iconBg }}
      >
        <span>{typeInfo.icon}</span>
      </div>
      <div className="record-info">
        <div className="record-top">
          <h3>{record.title}</h3>
          <div className="record-badges">
            <span className="badge badge-gray">{typeInfo.label}</span>
            {record.resolved && <span className="badge badge-success">✓ Résolu</span>}
          </div>
        </div>
        <div className="record-dates">
          {record.date && (
            <span className="record-date">{formatDateShort(record.date)}</span>
          )}
          {record.endDate && (
            <span className="record-date"> → {formatDateShort(record.endDate)}</span>
          )}
        </div>

        {expanded && (
          <div className="record-expanded" onClick={(e) => e.stopPropagation()}>
            {record.description && (
              <div className="record-section">
                <span className="record-section-label">🔍 Description</span>
                <p>{record.description}</p>
              </div>
            )}
            {record.treatment && (
              <div className="record-section">
                <span className="record-section-label">💊 Traitement</span>
                <p>{record.treatment}</p>
              </div>
            )}
            {record.veterinarian && (
              <div className="record-section">
                <span className="record-section-label">👨‍⚕️ Vétérinaire</span>
                <p>{record.veterinarian}</p>
              </div>
            )}
            <div className="record-action-row">
              <button className="action-btn action-btn--edit"
                onClick={() => onEdit(record)}>✏️ Modifier</button>
              <button className="action-btn action-btn--del"
                onClick={() => onDelete(record.id)}>🗑️ Supprimer</button>
            </div>
          </div>
        )}
      </div>
      <span className="record-chevron">{expanded ? '∧' : '∨'}</span>
    </div>
  );
}

export default function MedicalRecord({ petId, petName }) {
  const { getMedicalByPet, deleteMedical } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [filter, setFilter] = useState('all');

  const records = getMedicalByPet(petId);
  const sorted = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filtered = filter === 'all' ? sorted
    : filter === 'active' ? sorted.filter((r) => !r.resolved)
    : sorted.filter((r) => r.resolved);

  const handleDelete = (id) => {
    if (confirm('Supprimer ce dossier médical ?')) deleteMedical(id);
  };

  const handleEdit = (r) => { setEditRecord(r); setShowModal(true); };
  const handleClose = () => { setShowModal(false); setEditRecord(null); };

  return (
    <div className="medical-tab">
      <div className="tab-top">
        <h2 className="section-title">Dossier médical</h2>
        <button className="btn-icon" onClick={() => setShowModal(true)}>➕</button>
      </div>

      {sorted.length > 0 && (
        <div className="filter-tabs">
          {[['all', 'Tout'], ['active', 'En cours'], ['resolved', 'Résolu']].map(([val, label]) => (
            <button
              key={val}
              className={`filter-tab ${filter === val ? 'active' : ''}`}
              onClick={() => setFilter(val)}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 && sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏥</div>
          <p>Dossier médical vide.</p>
          <p>Enregistrez maladies, chirurgies et consultations.</p>
          <button className="btn-primary" style={{ marginTop: 16 }}
            onClick={() => setShowModal(true)}>
            ➕ Ajouter un dossier
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <p>Aucun dossier dans cette catégorie.</p>
        </div>
      ) : (
        <div className="items-list">
          {filtered.map((r) => (
            <RecordCard key={r.id} record={r} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showModal && (
        <RecordModal petId={petId} record={editRecord} onClose={handleClose} />
      )}
    </div>
  );
}
