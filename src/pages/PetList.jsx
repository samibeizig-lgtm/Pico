import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getAge } from '../utils/notifications';
import './PetList.css';

const PET_TYPES = {
  dog: { emoji: '🐕', label: 'Chien' },
  cat: { emoji: '🐈', label: 'Chat' },
  other: { emoji: '🐾', label: 'Autre' },
};

export default function PetList() {
  const navigate = useNavigate();
  const { pets, alerts } = useApp();

  const getAlertCount = (petId) =>
    alerts.filter((a) => a.petId === petId || a.id?.startsWith(petId)).length;

  return (
    <div className="petlist-page page">
      <div className="petlist-header">
        <h1>Mes Animaux</h1>
        <button className="add-pet-btn" onClick={() => navigate('/pets/add')}>
          ➕
        </button>
      </div>

      {pets.length === 0 ? (
        <div className="empty-state fade-in">
          <div className="empty-icon">🐾</div>
          <p>Aucun animal enregistré.</p>
          <p>Ajoutez votre premier compagnon !</p>
          <button
            className="btn-primary"
            style={{ marginTop: 20 }}
            onClick={() => navigate('/pets/add')}
          >
            ➕ Ajouter un animal
          </button>
        </div>
      ) : (
        <div className="pet-grid fade-in">
          {pets.map((pet) => {
            const typeInfo = PET_TYPES[pet.type] || PET_TYPES.other;
            const petAlerts = alerts.filter((a) => {
              const found = alerts.find(al => al.id === a.id);
              return found;
            });
            return (
              <div
                key={pet.id}
                className="pet-card"
                onClick={() => navigate(`/pets/${pet.id}`)}
              >
                <div className="pet-card-photo">
                  {pet.photo
                    ? <img src={pet.photo} alt={pet.name} />
                    : <span className="pet-card-emoji">{typeInfo.emoji}</span>
                  }
                </div>
                <div className="pet-card-info">
                  <div className="pet-card-top">
                    <h3>{pet.name}</h3>
                    <span className="badge badge-orange">{typeInfo.label}</span>
                  </div>
                  <div className="pet-card-details">
                    {pet.breed && <span>🐾 {pet.breed}</span>}
                    {pet.birthDate && <span>🎂 {getAge(pet.birthDate)}</span>}
                    {pet.weight && <span>⚖️ {pet.weight} kg</span>}
                    {pet.color && <span>🎨 {pet.color}</span>}
                  </div>
                </div>
                <div className="pet-card-arrow">›</div>
              </div>
            );
          })}

          <button
            className="pet-add-card"
            onClick={() => navigate('/pets/add')}
          >
            <span className="add-icon">➕</span>
            <span>Ajouter un animal</span>
          </button>
        </div>
      )}
    </div>
  );
}
