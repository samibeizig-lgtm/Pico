import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BellIcon, PawIcon, PillIcon, SyringeIcon } from '../components/Icons';
import './Home.css';

function DogIllustration() {
  return (
    <svg viewBox="0 0 280 260" fill="none" className="dog-svg">
      <circle cx="140" cy="130" r="110" fill="rgba(255,107,43,0.08)" />
      <path d="M 210 175 Q 245 145 240 110 Q 237 95 228 100"
        stroke="#FF8C5A" strokeWidth="14" strokeLinecap="round" fill="none"/>
      <ellipse cx="140" cy="185" rx="72" ry="55" fill="#FF8C5A"/>
      <ellipse cx="93" cy="68" rx="24" ry="34" fill="#E8651A" transform="rotate(-20 93 68)"/>
      <ellipse cx="93" cy="72" rx="15" ry="24" fill="#FF7535" transform="rotate(-20 93 72)"/>
      <ellipse cx="187" cy="68" rx="24" ry="34" fill="#E8651A" transform="rotate(20 187 68)"/>
      <ellipse cx="187" cy="72" rx="15" ry="24" fill="#FF7535" transform="rotate(20 187 72)"/>
      <circle cx="140" cy="108" r="52" fill="#FF8C5A"/>
      <ellipse cx="140" cy="120" rx="40" ry="28" fill="#FF9A6E" opacity="0.4"/>
      <circle cx="122" cy="100" r="12" fill="white"/>
      <circle cx="158" cy="100" r="12" fill="white"/>
      <circle cx="124" cy="101" r="8" fill="#0D1B2A"/>
      <circle cx="160" cy="101" r="8" fill="#0D1B2A"/>
      <circle cx="127" cy="98" r="3" fill="white"/>
      <circle cx="163" cy="98" r="3" fill="white"/>
      <ellipse cx="140" cy="118" rx="11" ry="8" fill="#1B2E4B"/>
      <ellipse cx="136" cy="115" rx="4" ry="2.5" fill="rgba(255,255,255,0.35)"/>
      <path d="M 131 124 Q 140 133 149 124" stroke="#1B2E4B" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <line x1="140" y1="126" x2="140" y2="130" stroke="#1B2E4B" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="110" cy="118" r="10" fill="#FF6B2B" opacity="0.25"/>
      <circle cx="170" cy="118" r="10" fill="#FF6B2B" opacity="0.25"/>
      <rect x="95" y="215" width="26" height="38" rx="13" fill="#FF8C5A"/>
      <rect x="159" y="215" width="26" height="38" rx="13" fill="#FF8C5A"/>
      <ellipse cx="108" cy="253" rx="13" ry="8" fill="#FF7035"/>
      <ellipse cx="172" cy="253" rx="13" ry="8" fill="#FF7035"/>
      <rect x="110" y="152" width="60" height="12" rx="6" fill="#1B2E4B"/>
      <circle cx="140" cy="158" r="5" fill="#FF6B2B"/>
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
    <div className="home-page">

      {/* ── TOP BAR ── */}
      <div className="home-topbar">
        <div>
          <p className="home-greeting">Bonjour !</p>
          <h1 className="home-title">
            <span className="pico">PICO</span>
            <span className="pets"> PETS</span>
          </h1>
        </div>
        <div className="home-topbar-right">
          <div className="home-date">{today}</div>
          {!notifPrefs.enabled && (
            <button className="notif-btn" onClick={enableNotifications} title="Activer les notifications">
              <BellIcon size={18} color="#FF6B2B" />
            </button>
          )}
        </div>
      </div>

      {/* ── DOG ── */}
      <div className="dog-container">
        <DogIllustration />
        <div className="dog-bubble">
          {pets.length === 0
            ? 'Ajoute ton premier animal !'
            : `${pets.length} animal${pets.length > 1 ? 'x' : ''} sous ma garde !`}
        </div>
      </div>

      {/* ── BOTTOM ZONE ── */}
      <div className="home-bottom">

        {/* Alerts (dark cards) */}
        {urgentAlerts.length > 0 && (
          <div className="alerts-row">
            {urgentAlerts.map((alert) => (
              <div key={alert.id} className="alert-pill alert-pill--urgent">
                {alert.type === 'vaccine'
                  ? <SyringeIcon size={16} color="#FF6B2B" />
                  : <PillIcon size={16} color="#FF6B2B" />}
                <span>{alert.petName} — {alert.title}</span>
                <span className="badge badge-danger">
                  {alert.days === 0 ? 'Auj. !' : `J-${alert.days}`}
                </span>
              </div>
            ))}
          </div>
        )}

        {alerts.filter((a) => a.days > 1).length > 0 && (
          <div className="alerts-row">
            {alerts.filter((a) => a.days > 1).map((alert) => (
              <div key={alert.id} className="alert-pill alert-pill--upcoming">
                {alert.type === 'vaccine'
                  ? <SyringeIcon size={16} color="#FF6B2B" />
                  : <PillIcon size={16} color="#FF6B2B" />}
                <span>{alert.petName} — {alert.title}</span>
                <span className="badge badge-warning">J-{alert.days}</span>
              </div>
            ))}
          </div>
        )}

        {/* Pets carousel — no photo, always paw icon */}
        {pets.length > 0 && (
          <div className="pets-scroll">
            {pets.slice(0, 6).map((pet) => (
              <div key={pet.id} className="pet-mini-card"
                onClick={() => navigate(`/pets/${pet.id}`)}>
                <div className="pet-mini-avatar">
                  <PawIcon size={30} color="#FF6B2B" />
                </div>
                <span className="pet-mini-name">{pet.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Bouton circulaire — toujours visible */}
        <div className="add-btn-wrap">
          <button className="add-circle-btn" onClick={() => navigate('/pets/add')}>
            <span className="add-circle-plus">＋</span>
            <span className="add-circle-label">
              {pets.length === 0 ? 'Ajouter mon\npremier animal' : 'Ajouter\nun animal'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
