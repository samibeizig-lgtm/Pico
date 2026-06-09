import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FREQUENCY_OPTIONS, computeNextDate, formatDateShort, getDaysUntil } from '../utils/notifications';
import './Treatments.css';

function TreatmentModal({ petId, treatment, onClose }) {
  const { addTreatment, updateTreatment } = useApp();
  const isEdit = Boolean(treatment);

  const [form, setForm] = useState({
    petId,
    name: treatment?.name || '',
    description: treatment?.description || '',
    frequency: treatment?.frequency || 'monthly',
    startDate: treatment?.startDate || new Date().toISOString().split('T')[0],
    nextDate: treatment?.nextDate || '',
    customDays: treatment?.customDays || '',
    notes: treatment?.notes || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => {
      const updated = { ...f, [name]: value };
      if (name === 'startDate' || name === 'frequency' || name === 'customDays') {
        updated.nextDate = computeNextDate(
          name === 'startDate' ? value : f.startDate,
          name === 'frequency' ? value : f.frequency,
          name === 'customDays' ? value : f.customDays
        );
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (isEdit) updateTreatment(treatment.id, form);
    else addTreatment(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Modifier le traitement' : 'Nouveau traitement'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nom du traitement *</label>
            <input name="name" value={form.name} onChange={handleChange}
              className="form-control" placeholder="Ex: Antiparasitaire" required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input name="description" value={form.description} onChange={handleChange}
              className="form-control" placeholder="Ex: Frontline, 1 pipette" />
          </div>
          <div className="form-group">
            <label>Fréquence</label>
            <select name="frequency" value={form.frequency} onChange={handleChange}
              className="form-control">
              {FREQUENCY_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
          {form.frequency === 'custom' && (
            <div className="form-group">
              <label>Tous les X jours</label>
              <input type="number" name="customDays" value={form.customDays}
                onChange={handleChange} className="form-control" placeholder="30" min="1" />
            </div>
          )}
          <div className="form-group">
            <label>Date de début</label>
            <input type="date" name="startDate" value={form.startDate}
              onChange={handleChange} className="form-control" />
          </div>
          {form.nextDate && (
            <div className="next-date-preview">
              📅 Prochain traitement : <strong>{formatDateShort(form.nextDate)}</strong>
            </div>
          )}
          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange}
              className="form-control" rows={2} placeholder="Dosage, remarques..." />
          </div>
          <button type="submit" className="btn-primary">
            {isEdit ? '✅ Enregistrer' : '➕ Ajouter'}
          </button>
        </form>
      </div>
    </div>
  );
}

function TreatmentCard({ treatment, onEdit, onDelete }) {
  const days = getDaysUntil(treatment.nextDate);
  const freq = FREQUENCY_OPTIONS.find((f) => f.value === treatment.frequency);

  const getStatusBadge = () => {
    if (days === null) return null;
    if (days < 0) return <span className="badge badge-danger">En retard</span>;
    if (days === 0) return <span className="badge badge-danger">Aujourd'hui !</span>;
    if (days <= 3) return <span className="badge badge-warning">Dans {days} j.</span>;
    if (days <= 7) return <span className="badge badge-orange">Dans {days} j.</span>;
    return <span className="badge badge-success">Dans {days} j.</span>;
  };

  return (
    <div className="treatment-card">
      <div className="treatment-icon">💊</div>
      <div className="treatment-info">
        <div className="treatment-top">
          <h3>{treatment.name}</h3>
          {getStatusBadge()}
        </div>
        {treatment.description && (
          <p className="treatment-desc">{treatment.description}</p>
        )}
        <div className="treatment-meta">
          {freq && <span className="badge badge-blue">{freq.label}</span>}
          {treatment.nextDate && (
            <span className="treatment-date">
              Prochain : {formatDateShort(treatment.nextDate)}
            </span>
          )}
        </div>
        {treatment.notes && (
          <p className="treatment-notes">{treatment.notes}</p>
        )}
      </div>
      <div className="treatment-actions">
        <button onClick={() => onEdit(treatment)} className="action-btn action-btn--edit">✏️</button>
        <button onClick={() => onDelete(treatment.id)} className="action-btn action-btn--del">🗑️</button>
      </div>
    </div>
  );
}

export default function Treatments({ petId, petName }) {
  const { getTreatmentsByPet, deleteTreatment, alerts } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editTreatment, setEditTreatment] = useState(null);

  const treatments = getTreatmentsByPet(petId);
  const sorted = [...treatments].sort((a, b) => {
    if (!a.nextDate) return 1;
    if (!b.nextDate) return -1;
    return new Date(a.nextDate) - new Date(b.nextDate);
  });

  const handleDelete = (id) => {
    if (confirm('Supprimer ce traitement ?')) deleteTreatment(id);
  };

  const handleEdit = (t) => {
    setEditTreatment(t);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditTreatment(null);
  };

  return (
    <div className="treatments-tab">
      <div className="tab-top">
        <h2 className="section-title">Traitements de {petName}</h2>
        <button className="btn-icon" onClick={() => setShowModal(true)}>➕</button>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💊</div>
          <p>Aucun traitement enregistré.</p>
          <p>Ajoutez les médicaments et soins réguliers.</p>
          <button className="btn-primary" style={{ marginTop: 16 }}
            onClick={() => setShowModal(true)}>
            ➕ Ajouter un traitement
          </button>
        </div>
      ) : (
        <div className="items-list">
          {sorted.map((t) => (
            <TreatmentCard
              key={t.id} treatment={t}
              onEdit={handleEdit} onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showModal && (
        <TreatmentModal
          petId={petId}
          treatment={editTreatment}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
