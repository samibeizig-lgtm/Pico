import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getAge, formatDate } from '../utils/notifications';
import Treatments from './Treatments';
import Vaccines from './Vaccines';
import MedicalRecord from './MedicalRecord';
import './PetDetail.css';

const TABS = [
  { id: 'info', label: 'Profil', icon: '🐾' },
  { id: 'treatments', label: 'Traitements', icon: '💊' },
  { id: 'vaccines', label: 'Vaccins', icon: '💉' },
  { id: 'medical', label: 'Médical', icon: '🏥' },
];

const PET_TYPES = {
  dog: { emoji: '🐕', label: 'Chien' },
  cat: { emoji: '🐈', label: 'Chat' },
  rabbit: { emoji: '🐇', label: 'Lapin' },
  bird: { emoji: '🦜', label: 'Oiseau' },
  other: { emoji: '🐾', label: 'Autre' },
};

function InfoTab({ pet }) {
  const navigate = useNavigate();
  const typeInfo = PET_TYPES[pet.type] || PET_TYPES.other;

  const fields = [
    { label: 'Type', value: typeInfo.label, icon: typeInfo.emoji },
    { label: 'Race', value: pet.breed, icon: '🐾' },
    { label: 'Couleur', value: pet.color, icon: '🎨' },
    { label: 'Date de naissance', value: formatDate(pet.birthDate), icon: '🎂' },
    { label: 'Âge', value: getAge(pet.birthDate), icon: '📅' },
    { label: 'Poids', value: pet.weight ? `${pet.weight} kg` : null, icon: '⚖️' },
    { label: 'Taille', value: pet.height ? `${pet.height} cm` : null, icon: '📏' },
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
          <h3 className="card-subtitle">📝 Notes</h3>
          <p className="notes-text">{pet.notes}</p>
        </div>
      )}

      <button
        className="btn-secondary"
        style={{ marginTop: 16 }}
        onClick={() => navigate(`/pets/${pet.id}/edit`)}
      >
        ✏️ Modifier le profil
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
  const petAlerts = alerts.filter((a) => {
    return (
      (a.type === 'treatment' || a.type === 'vaccine') &&
      true
    );
  });

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
              : <span>{typeInfo.emoji}</span>
            }
          </div>
          <div className="petdetail-meta">
            <h1>{pet.name}</h1>
            <div className="petdetail-badges">
              <span className="badge badge-orange">{typeInfo.label}</span>
              {pet.breed && <span className="badge badge-blue">{pet.breed}</span>}
              {pet.birthDate && (
                <span className="badge badge-gray">{getAge(pet.birthDate)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Alerts banner */}
        {(treatmentAlerts.length > 0 || vaccineAlerts.length > 0) && (
          <div className="petdetail-alerts">
            {treatmentAlerts.length > 0 && (
              <div className="alert-mini">
                💊 {treatmentAlerts.length} traitement{treatmentAlerts.length > 1 ? 's' : ''} à venir
              </div>
            )}
            {vaccineAlerts.length > 0 && (
              <div className="alert-mini alert-mini--vaccine">
                💉 {vaccineAlerts.length} vaccin{vaccineAlerts.length > 1 ? 's' : ''} à venir
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
            <span>{tab.icon}</span>
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
