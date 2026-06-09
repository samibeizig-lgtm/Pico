import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './AddEditPet.css';

const PET_TYPES = [
  { value: 'dog', label: 'Chien', emoji: '🐕' },
  { value: 'cat', label: 'Chat', emoji: '🐈' },
  { value: 'rabbit', label: 'Lapin', emoji: '🐇' },
  { value: 'bird', label: 'Oiseau', emoji: '🦜' },
  { value: 'other', label: 'Autre', emoji: '🐾' },
];

export default function AddEditPet() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addPet, updatePet, getPetById, deletePet } = useApp();
  const fileRef = useRef(null);
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '', type: 'dog', breed: '', birthDate: '',
    color: '', weight: '', height: '', photo: '', notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      const pet = getPetById(id);
      if (pet) setForm({ ...pet });
      else navigate('/pets');
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((f) => ({ ...f, photo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Le nom est requis';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (isEdit) {
      updatePet(id, form);
      navigate(`/pets/${id}`);
    } else {
      const pet = addPet(form);
      navigate(`/pets/${pet.id}`);
    }
  };

  const handleDelete = () => {
    if (confirm(`Supprimer ${form.name} ? Cette action est irréversible.`)) {
      deletePet(id);
      navigate('/pets');
    }
  };

  return (
    <div className="addedit-page page">
      <div className="addedit-header">
        <button className="back-btn" onClick={() => navigate(isEdit ? `/pets/${id}` : '/pets')}>
          ‹
        </button>
        <h1>{isEdit ? 'Modifier' : 'Ajouter un animal'}</h1>
        <div style={{ width: 40 }} />
      </div>

      <form onSubmit={handleSubmit} className="addedit-form">
        {/* Photo */}
        <div className="photo-section">
          <div className="photo-preview" onClick={() => fileRef.current?.click()}>
            {form.photo
              ? <img src={form.photo} alt="Photo" />
              : (
                <div className="photo-placeholder">
                  <span>📷</span>
                  <span>Ajouter une photo</span>
                </div>
              )}
          </div>
          <input
            type="file" accept="image/*" ref={fileRef}
            onChange={handlePhoto} style={{ display: 'none' }}
          />
          {form.photo && (
            <button
              type="button" className="remove-photo"
              onClick={() => setForm((f) => ({ ...f, photo: '' }))}
            >
              Supprimer la photo
            </button>
          )}
        </div>

        {/* Type */}
        <div className="form-group">
          <label>Type d'animal</label>
          <div className="type-selector">
            {PET_TYPES.map((t) => (
              <button
                key={t.value} type="button"
                className={`type-btn ${form.type === t.value ? 'active' : ''}`}
                onClick={() => setForm((f) => ({ ...f, type: t.value }))}
              >
                <span>{t.emoji}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="form-group">
          <label>Nom *</label>
          <input
            name="name" value={form.name} onChange={handleChange}
            className={`form-control ${errors.name ? 'error' : ''}`}
            placeholder="Ex: Rex, Luna..."
          />
          {errors.name && <span className="error-msg">{errors.name}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Race</label>
            <input name="breed" value={form.breed} onChange={handleChange}
              className="form-control" placeholder="Ex: Labrador" />
          </div>
          <div className="form-group">
            <label>Couleur</label>
            <input name="color" value={form.color} onChange={handleChange}
              className="form-control" placeholder="Ex: Brun" />
          </div>
        </div>

        <div className="form-group">
          <label>Date de naissance</label>
          <input type="date" name="birthDate" value={form.birthDate}
            onChange={handleChange} className="form-control" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Poids (kg)</label>
            <input type="number" step="0.1" name="weight" value={form.weight}
              onChange={handleChange} className="form-control" placeholder="0.0" />
          </div>
          <div className="form-group">
            <label>Taille (cm)</label>
            <input type="number" step="0.1" name="height" value={form.height}
              onChange={handleChange} className="form-control" placeholder="0" />
          </div>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange}
            className="form-control" rows={3}
            placeholder="Informations complémentaires..." />
        </div>

        <button type="submit" className="btn-primary">
          {isEdit ? '✅ Enregistrer les modifications' : '✅ Ajouter l\'animal'}
        </button>

        {isEdit && (
          <>
            <div className="divider" />
            <button type="button" className="btn-danger" onClick={handleDelete}>
              🗑️ Supprimer {form.name}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
