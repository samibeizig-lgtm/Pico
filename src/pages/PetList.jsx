import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getAge } from '../utils/notifications';
import { PawIcon, CalendarIcon, WeightIcon, PaletteIcon } from '../components/Icons';
import './PetList.css';

const PET_TYPES = {
  dog: { label: 'Chien' },
  cat: { label: 'Chat' },
  other: { label: 'Autre' },
};

export default function PetList() {
  const navigate = useNavigate();
  const { pets } = useApp();

  return (
    <div className="petlist-page page">
      <div className="petlist-header">
        <h1>Mes Animaux</h1>
      </div>

      {pets.length === 0 ? (
        <div className="empty-state fade-in">
          <div className="empty-icon"><PawIcon size={48} color="#FF6B2B" /></div>
          <p>Aucun animal enregistré.</p>
          <p>Ajoutez votre premier compagnon !</p>
          <button
            className="btn-primary"
            style={{ marginTop: 20 }}
            onClick={() => navigate('/pets/add')}
          >
            Ajouter un animal
          </button>
        </div>
      ) : (
        <div className="pet-grid fade-in">
          {pets.map((pet) => {
            const typeInfo = PET_TYPES[pet.type] || PET_TYPES.other;
            return (
              <div
                key={pet.id}
                className="pet-card"
                onClick={() => navigate(`/pets/${pet.id}`)}
              >
                <div className="pet-card-photo">
                  {pet.photo
                    ? <img src={pet.photo} alt={pet.name} />
                    : <PawIcon size={36} color="#FF6B2B" />
                  }
                </div>
                <div className="pet-card-info">
                  <div className="pet-card-top">
                    <h3>{pet.name}</h3>
                    <span className="badge badge-orange">{typeInfo.label}</span>
                  </div>
                  <div className="pet-card-details">
                    {pet.breed && (
                      <span className="detail-chip">
                        <PawIcon size={11} color="#FF6B2B" /> {pet.breed}
                      </span>
                    )}
                    {pet.birthDate && (
                      <span className="detail-chip">
                        <CalendarIcon size={11} color="#FF6B2B" /> {getAge(pet.birthDate)}
                      </span>
                    )}
                    {pet.weight && (
                      <span className="detail-chip">
                        <WeightIcon size={11} color="#FF6B2B" /> {pet.weight} kg
                      </span>
                    )}
                    {pet.color && (
                      <span className="detail-chip">
                        <PaletteIcon size={11} color="#FF6B2B" /> {pet.color}
                      </span>
                    )}
                  </div>
                </div>
                <div className="pet-card-arrow">›</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
