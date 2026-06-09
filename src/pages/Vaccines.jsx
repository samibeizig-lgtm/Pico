import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDateShort, getDaysUntil } from '../utils/notifications';
import './Vaccines.css';

function VaccineModal({ petId, vaccine, onClose }) {
  const { addVaccine, updateVaccine } = useApp();
  const isEdit = Boolean(vaccine);

  const [form, setForm] = useState({
    petId,
    name: vaccine?.name || '',
    date: vaccine?.date || new Date().toISOString().split('T')[0],
    nextDate: vaccine?.nextDate || '',
    veterinarian: vaccine?.veterinarian || '',
    lot: vaccine?.lot || '',
    notes: vaccine?.notes || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (isEdit) updateVaccine(vaccine.id, form);
    else addVaccine(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Modifier le vaccin' : 'Nouveau vaccin'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nom du vaccin *</label>
            <input name="name" value={form.name} onChange={handleChange}
              className="form-control" placeholder="Ex: Rage, Carré, DHPP..." required />
          </div>
          <div className="form-group">
            <label>Date de vaccination</label>
            <input type="date" name="date" value={form.date}
              onChange={handleChange} className="form-control" />
          </div>
          <div className="form-group">
            <label>Date du prochain rappel</label>
            <input type="date" name="nextDate" value={form.nextDate}
              onChange={handleChange} className="form-control" />
          </div>
          <div className="form-group">
            <label>Vétérinaire</label>
            <input name="veterinarian" value={form.veterinarian} onChange={handleChange}
              className="form-control" placeholder="Nom du vétérinaire" />
          </div>
          <div className="form-group">
            <label>N° de lot</label>
            <input name="lot" value={form.lot} onChange={handleChange}
              className="form-control" placeholder="Numéro de lot du vaccin" />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange}
              className="form-control" rows={2} placeholder="Réaction, remarques..." />
          </div>
          <button type="submit" className="btn-primary">
            {isEdit ? '✅ Enregistrer' : '➕ Ajouter'}
          </button>
        </form>
      </div>
    </div>
  );
}

function VaccineCard({ vaccine, onEdit, onDelete }) {
  const days = getDaysUntil(vaccine.nextDate);

  const getStatusBadge = () => {
    if (days === null) return null;
    if (days < 0) return <span className="badge badge-danger">Rappel en retard</span>;
    if (days === 0) return <span className="badge badge-danger">Rappel aujourd'hui !</span>;
    if (days <= 7) return <span className="badge badge-warning">Rappel dans {days} j.</span>;
    if (days <= 30) return <span className="badge badge-orange">Rappel dans {days} j.</span>;
    return <span className="badge badge-success">À jour</span>;
  };

  return (
    <div className="vaccine-card">
      <div className="vaccine-icon-wrap">
        <span className="vaccine-icon">💉</span>
      </div>
      <div className="vaccine-info">
        <div className="vaccine-top">
          <h3>{vaccine.name}</h3>
          {getStatusBadge()}
        </div>
        <div className="vaccine-dates">
          {vaccine.date && (
            <div className="vaccine-date-row">
              <span className="vd-label">Effectué le</span>
              <span className="vd-value">{formatDateShort(vaccine.date)}</span>
            </div>
          )}
          {vaccine.nextDate && (
            <div className="vaccine-date-row next">
              <span className="vd-label">Prochain rappel</span>
              <span className="vd-value">{formatDateShort(vaccine.nextDate)}</span>
            </div>
          )}
        </div>
        {vaccine.veterinarian && (
          <p className="vaccine-vet">👨‍⚕️ {vaccine.veterinarian}</p>
        )}
        {vaccine.lot && (
          <p className="vaccine-lot">🔢 Lot: {vaccine.lot}</p>
        )}
        {vaccine.notes && (
          <p className="vaccine-notes">{vaccine.notes}</p>
        )}
      </div>
      <div className="treatment-actions">
        <button onClick={() => onEdit(vaccine)} className="action-btn action-btn--edit">✏️</button>
        <button onClick={() => onDelete(vaccine.id)} className="action-btn action-btn--del">🗑️</button>
      </div>
    </div>
  );
}

export default function Vaccines({ petId, petName }) {
  const { getVaccinesByPet, deleteVaccine } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editVaccine, setEditVaccine] = useState(null);

  const vaccines = getVaccinesByPet(petId);
  const sorted = [...vaccines].sort((a, b) => {
    if (!a.nextDate) return 1;
    if (!b.nextDate) return -1;
    return new Date(a.nextDate) - new Date(b.nextDate);
  });

  const handleDelete = (id) => {
    if (confirm('Supprimer ce vaccin ?')) deleteVaccine(id);
  };

  const handleEdit = (v) => { setEditVaccine(v); setShowModal(true); };
  const handleClose = () => { setShowModal(false); setEditVaccine(null); };

  const upcoming = sorted.filter((v) => {
    const d = getDaysUntil(v.nextDate);
    return d !== null && d >= 0;
  });
  const past = sorted.filter((v) => {
    const d = getDaysUntil(v.nextDate);
    return d === null || d < 0;
  });

  return (
    <div className="vaccines-tab">
      <div className="tab-top">
        <h2 className="section-title">Vaccins de {petName}</h2>
        <button className="btn-icon" onClick={() => setShowModal(true)}>➕</button>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💉</div>
          <p>Aucun vaccin enregistré.</p>
          <p>Suivez le carnet de santé de votre animal.</p>
          <button className="btn-primary" style={{ marginTop: 16 }}
            onClick={() => setShowModal(true)}>
            ➕ Ajouter un vaccin
          </button>
        </div>
      ) : (
        <div className="items-list">
          {upcoming.length > 0 && (
            <>
              <p className="list-section-label">🔔 Prochains rappels</p>
              {upcoming.map((v) => (
                <VaccineCard key={v.id} vaccine={v} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </>
          )}
          {past.length > 0 && (
            <>
              {upcoming.length > 0 && <div className="divider" />}
              <p className="list-section-label">📋 Historique</p>
              {past.map((v) => (
                <VaccineCard key={v.id} vaccine={v} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </>
          )}
        </div>
      )}

      {showModal && (
        <VaccineModal petId={petId} vaccine={editVaccine} onClose={handleClose} />
      )}
    </div>
  );
}
