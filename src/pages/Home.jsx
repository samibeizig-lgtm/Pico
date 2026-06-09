import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatDateShort, getDaysUntil } from '../utils/notifications';
import './Home.css';

function DogIllustration() {
  return (
    <svg viewBox="0 0 280 260" fill="none" className="dog-svg">
      {/* Background circle */}
      <circle cx="140" cy="130" r="110" fill="rgba(255,107,43,0.08)" />

      {/* Tail */}
      <path d="M 210 175 Q 245 145 240 110 Q 237 95 228 100"
        stroke="#FF8C5A" strokeWidth="14" strokeLinecap="round" fill="none"/>

      {/* Body */}
      <ellipse cx="140" cy="185" rx="72" ry="55" fill="#FF8C5A"/>

      {/* Left ear */}
      <ellipse cx="93" cy="68" rx="24" ry="34" fill="#E8651A" transform="rotate(-20 93 68)"/>
      <ellipse cx="93" cy="72" rx="15" ry="24" fill="#FF7535" transform="rotate(-20 93 72)"/>

      {/* Right ear */}
      <ellipse cx="187" cy="68" rx="24" ry="34" fill="#E8651A" transform="rotate(20 187 68)"/>
      <ellipse cx="187" cy="72" rx="15" ry="24" fill="#FF7535" transform="rotate(20 187 72)"/>

      {/* Head */}
      <circle cx="140" cy="108" r="52" fill="#FF8C5A"/>

      {/* Head shading */}
      <ellipse cx="140" cy="120" rx="40" ry="28" fill="#FF9A6E" opacity="0.4"/>

      {/* Left eye white */}
      <circle cx="122" cy="100" r="12" fill="white"/>
      {/* Right eye white */}
      <circle cx="158" cy="100" r="12" fill="white"/>

      {/* Left eye */}
      <circle cx="124" cy="101" r="8" fill="#0D1B2A"/>
      {/* Right eye */}
      <circle cx="160" cy="101" r="8" fill="#0D1B2A"/>

      {/* Eye shine left */}
      <circle cx="127" cy="98" r="3" fill="white"/>
      {/* Eye shine right */}
      <circle cx="163" cy="98" r="3" fill="white"/>

      {/* Nose */}
      <ellipse cx="140" cy="118" rx="11" ry="8" fill="#1B2E4B"/>
      {/* Nose shine */}
      <ellipse cx="136" cy="115" rx="4" ry="2.5" fill="rgba(255,255,255,0.35)"/>

      {/* Mouth */}
      <path d="M 131 124 Q 140 133 149 124" stroke="#1B2E4B" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <line x1="140" y1="126" x2="140" y2="130" stroke="#1B2E4B" strokeWidth="2.5" strokeLinecap="round"/>

      {/* Cheeks */}
      <circle cx="110" cy="118" r="10" fill="#FF6B2B" opacity="0.25"/>
      <circle cx="170" cy="118" r="10" fill="#FF6B2B" opacity="0.25"/>

      {/* Front left leg */}
      <rect x="95" y="215" width="26" height="38" rx="13" fill="#FF8C5A"/>
      {/* Front right leg */}
      <rect x="159" y="215" width="26" height="38" rx="13" fill="#FF8C5A"/>

      {/* Paw left */}
      <ellipse cx="108" cy="253" rx="13" ry="8" fill="#FF7035"/>
      {/* Paw right */}
      <ellipse cx="172" cy="253" rx="13" ry="8" fill="#FF7035"/>

      {/* Collar */}
      <rect x="110" y="152" width="60" height="12" rx="6" fill="#1B2E4B"/>
      <circle cx="140" cy="158" r="5" fill="#FF6B2B"/>

      {/* Spots on body */}
      <ellipse cx="115" cy="185" rx="14" ry="10" fill="#FF7035" opacity="0.35"/>
      <ellipse cx="165" cy="195" rx="12" ry="9" fill="#FF7035" opacity="0.35"/>
    </svg>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { pets, alerts, enableNotifications, notifPrefs } = useApp();

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  const urgentAlerts = alerts.filter((a) => a.days <= 1);

  return (
    <div className="home-page page">
      {/* Header */}
      <div className="home-header">
        <div className="home-header-top">
          <div>
            <p className="home-greeting">Bonjour ! 👋</p>
            <h1 className="home-title">
              <span className="pico">PICO</span>
              <span className="pets"> PETS</span>
            </h1>
          </div>
          <div className="home-date">{today}</div>
        </div>

        {/* Dog Illustration */}
        <div className="dog-container">
          <DogIllustration />
          <div className="dog-bubble">
            {pets.length === 0
              ? 'Ajoute ton premier animal ! 🐾'
              : `${pets.length} animal${pets.length > 1 ? 'x' : ''} sous ma garde !`}
          </div>
        </div>
      </div>

      <div className="home-content">
        {/* Urgent alerts */}
        {urgentAlerts.length > 0 && (
          <div className="alerts-section slide-up">
            <h2 className="section-title">⚠️ Urgent</h2>
            {urgentAlerts.map((alert) => (
              <div key={alert.id} className="alert-card">
                <div className="alert-icon">
                  {alert.type === 'vaccine' ? '💉' : '💊'}
                </div>
                <div className="alert-info">
                  <strong>{alert.petName}</strong>
                  <span>{alert.title}</span>
                  <span className={`badge ${alert.days === 0 ? 'badge-danger' : 'badge-warning'}`}>
                    {alert.days === 0 ? "Aujourd'hui !" : `Dans ${alert.days} j.`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* All alerts */}
        {alerts.length > urgentAlerts.length && (
          <div className="slide-up">
            <h2 className="section-title">🔔 À venir</h2>
            {alerts.filter((a) => a.days > 1).map((alert) => (
              <div key={alert.id} className="alert-card alert-card--upcoming">
                <div className="alert-icon">
                  {alert.type === 'vaccine' ? '💉' : '💊'}
                </div>
                <div className="alert-info">
                  <strong>{alert.petName}</strong>
                  <span>{alert.title}</span>
                  <span className="badge badge-orange">Dans {alert.days} jours</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick actions */}
        <div className="quick-actions slide-up">
          <h2 className="section-title">Actions rapides</h2>
          <div className="quick-grid">
            <button className="quick-btn" onClick={() => navigate('/pets/add')}>
              <span className="quick-icon">➕</span>
              <span>Ajouter<br/>un animal</span>
            </button>
            <button className="quick-btn" onClick={() => navigate('/pets')}>
              <span className="quick-icon">🐾</span>
              <span>Voir mes<br/>animaux</span>
            </button>
            {!notifPrefs.enabled && (
              <button className="quick-btn quick-btn--notif" onClick={enableNotifications}>
                <span className="quick-icon">🔔</span>
                <span>Activer les<br/>notifications</span>
              </button>
            )}
          </div>
        </div>

        {/* Recent pets */}
        {pets.length > 0 && (
          <div className="slide-up">
            <h2 className="section-title">Mes animaux</h2>
            <div className="pets-scroll">
              {pets.slice(0, 4).map((pet) => (
                <div
                  key={pet.id}
                  className="pet-mini-card"
                  onClick={() => navigate(`/pets/${pet.id}`)}
                >
                  <div className="pet-mini-avatar">
                    {pet.photo
                      ? <img src={pet.photo} alt={pet.name} />
                      : <span>{pet.type === 'dog' ? '🐕' : pet.type === 'cat' ? '🐈' : '🐾'}</span>
                    }
                  </div>
                  <span className="pet-mini-name">{pet.name}</span>
                </div>
              ))}
              <div
                className="pet-mini-card pet-mini-add"
                onClick={() => navigate('/pets/add')}
              >
                <div className="pet-mini-avatar pet-mini-avatar--add">➕</div>
                <span className="pet-mini-name">Ajouter</span>
              </div>
            </div>
          </div>
        )}

        {/* No pets state */}
        {pets.length === 0 && (
          <div className="no-pets-cta slide-up">
            <p>Commencez par ajouter votre premier animal de compagnie pour suivre sa santé et ses traitements.</p>
            <button className="btn-primary" onClick={() => navigate('/pets/add')}>
              ➕ Ajouter mon premier animal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
