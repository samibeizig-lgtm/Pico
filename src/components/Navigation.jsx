import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Navigation.css';

const tabs = [
  { path: '/', icon: '🏠', label: 'Accueil' },
  { path: '/pets', icon: '🐾', label: 'Mes Animaux' },
];

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { alerts } = useApp();

  const isDetail = location.pathname.startsWith('/pets/') &&
    location.pathname !== '/pets/add' &&
    !location.pathname.endsWith('/edit');

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const isActive = tab.path === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(tab.path);
        return (
          <button
            key={tab.path}
            className={`nav-tab ${isActive ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <span className="nav-icon">
              {tab.icon}
              {tab.path === '/pets' && alerts.length > 0 && (
                <span className="nav-badge">{alerts.length}</span>
              )}
            </span>
            <span className="nav-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
