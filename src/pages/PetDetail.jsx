import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getAge, formatDate } from '../utils/notifications';
import {
  PawIcon, PillIcon, SyringeIcon, MedicalCrossIcon,
  CalendarIcon, WeightIcon, RulerIcon, PaletteIcon, NoteIcon, EditIcon
} from '../components/Icons';
import Treatments from './Treatments';
import Vaccines from './Vaccines';
import MedicalRecord from './MedicalRecord';
import './PetDetail.css';

const TABS = [
  { id: 'info', label: 'Profil', icon: <PawIcon size={18} /> },
  { id: 'treatments', label: 'Traitements', icon: <PillIcon size={18} /> },
  { id: 'vaccines', label: 'Vaccins', icon: <SyringeIcon size={18} /> },
  { id: 'medical', label: 'Médical', icon: <MedicalCrossIcon size={18} /> },
];

const PET_TYPES = {
  dog: { label: 'Chien' },
  cat: { label: 'Chat' },
  rabbit: { label: 'Lapin' },
  bird: { label: 'Oiseau' },
  other: { label: 'Autre' },
};

function InfoTab({ pet }) {
  const navigate = useNavigate();
  const typeInfo = PET_TYPES[pet.type] || PET_TYPES.other;

  const fields = [
    { label: 'Type', value: typeInfo.label, icon: <PawIcon size={18} color="var(--orange)" /> },
    { label: 'Race', value: pet.breed, icon: <PawIcon size={18} color="var(--orange)" /> },
    { label: 'Couleur', value: pet.color, icon: <PaletteIcon size={18} color="var(--orange)" /> },
    { label: 'Date de naissance', value: formatDate(pet.birthDate), icon: <CalendarIcon size={18} color="var(--orange)" /> },
    { label: 'Âge', value: getAge(pet.birthDate), icon: <CalendarIcon size={18} color="var(--orange)" /> },
    { label: 'Poids', value: pet.weight ? `${pet.weight} kg` : null, icon: <WeightIcon size={18} color="var(--orange)" /> },
    { label: 'Taille', value: pet.height ? `${pet.height} cm` : null, icon: <RulerIcon size={18} color="var(--orange)" /> },
  ].filter((f) => f.value && f.value !== '-');

  return (
    <div className="info-tab">
      <div className="card">
        <div className="info-grid">
          {fields.map((f) => (
            <div key={f.label} className="info-item">
              <span className="info-icon">{f.icon}</span>
              <div>
                <span className="info-label">{f.label}</span>
                <span className="info-value">{f.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {pet.notes && (
        <div className="card" style={{ marginTop: 12 }}>
          <h3 className="card-subtitle">
            <NoteIcon size={16} color="var(--blue-dark)" style={{ verticalAlign: 'middle', marginRight: 4 }} />
            Notes
          </h3>
          <p className="notes-text">{pet.notes}</p>
        </div>
      )}

      <button
        className="btn-secondary"
        style={{ marginTop: 16 }}
        onClick={() => navigate(`/pets/${pet.id}/edit`)}
      >
        <EditIcon size={15} color="var(--orange)" /> Modifier le profil
      </button>
    </div>
  );
}

export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPetById, alerts } = useApp();
  const [activeTab, setActiveTab] = useState('info');

  const pet = getPetById(id);
  if (!pet) {
    navigate('/pets');
    return null;
  }

  const typeInfo = PET_TYPES[pet.type] || PET_TYPES.other;

  const treatmentAlerts = alerts.filter(
    (a) => a.type === 'treatment' && a.petName === pet.name
  );
  const vaccineAlerts = alerts.filter(
    (a) => a.type === 'vaccine' && a.petName === pet.name
  );

  return (
    <div className="petdetail-page page">
      {/* Header */}
      <div className="petdetail-header">
        <button className="back-btn" onClick={() => navigate('/pets')}>‹</button>
        <div className="petdetail-hero">
          <div className="petdetail-avatar">
            {pet.photo
              ? <img src={pet.photo} alt={pet.name} />
              : <PawIcon size={52} color="#FF6B2B" />
            }
          </div>
          <h1 className="petdetail-name">{pet.name}</h1>
          {/* Only breed badge — no type, no age */}
          {pet.breed && (
            <div className="petdetail-badges">
              <span className="badge badge-blue">{pet.breed}</span>
            </div>
          )}
        </div>

        {/* Alerts banner */}
        {(treatmentAlerts.length > 0 || vaccineAlerts.length > 0) && (
          <div className="petdetail-alerts">
            {treatmentAlerts.length > 0 && (
              <div className="alert-mini">
                <PillIcon size={13} color="#FCA5A5" /> {treatmentAlerts.length} traitement{treatmentAlerts.length > 1 ? 's' : ''} à venir
              </div>
            )}
            {vaccineAlerts.length > 0 && (
              <div className="alert-mini alert-mini--vaccine">
                <SyringeIcon size={13} color="#FCD34D" /> {vaccineAlerts.length} vaccin{vaccineAlerts.length > 1 ? 's' : ''} à venir
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="tabs-bar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="tab-content">
        {activeTab === 'info' && <InfoTab pet={pet} />}
        {activeTab === 'treatments' && <Treatments petId={id} petName={pet.name} />}
        {activeTab === 'vaccines' && <Vaccines petId={id} petName={pet.name} />}
        {activeTab === 'medical' && <MedicalRecord petId={id} petName={pet.name} />}
      </div>
    </div>
  );
}
