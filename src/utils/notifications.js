export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const sendNotification = (title, body, icon = '/pico-icon.svg') => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification(title, { body, icon });
};

export const getDaysUntil = (dateStr) => {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
};

export const checkUpcomingAlerts = (treatments, vaccines, pets, daysAhead = 3) => {
  const alerts = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  treatments.forEach((t) => {
    if (!t.nextDate) return;
    const days = getDaysUntil(t.nextDate);
    if (days !== null && days >= 0 && days <= daysAhead) {
      const pet = pets.find((p) => p.id === t.petId);
      alerts.push({
        type: 'treatment',
        id: t.id,
        petName: pet?.name || 'Animal',
        title: t.name,
        days,
        date: t.nextDate,
      });
    }
  });

  vaccines.forEach((v) => {
    if (!v.nextDate) return;
    const days = getDaysUntil(v.nextDate);
    if (days !== null && days >= 0 && days <= daysAhead) {
      const pet = pets.find((p) => p.id === v.petId);
      alerts.push({
        type: 'vaccine',
        id: v.id,
        petName: pet?.name || 'Animal',
        title: v.name,
        days,
        date: v.nextDate,
      });
    }
  });

  return alerts;
};

export const FREQUENCY_OPTIONS = [
  { value: 'monthly', label: 'Mensuel (1 mois)', days: 30 },
  { value: '3months', label: 'Tous les 3 mois', days: 90 },
  { value: '6months', label: 'Tous les 6 mois', days: 180 },
  { value: 'yearly', label: 'Annuel', days: 365 },
  { value: 'weekly', label: 'Hebdomadaire', days: 7 },
  { value: 'custom', label: 'Personnalisé', days: null },
];

export const computeNextDate = (startDate, frequency, customDays) => {
  if (!startDate) return '';
  const freq = FREQUENCY_OPTIONS.find((f) => f.value === frequency);
  const days = frequency === 'custom' ? parseInt(customDays) : freq?.days;
  if (!days) return '';
  const d = new Date(startDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export const formatDateShort = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const getAge = (birthDate) => {
  if (!birthDate) return '-';
  const birth = new Date(birthDate);
  const today = new Date();
  const years = today.getFullYear() - birth.getFullYear();
  const months = today.getMonth() - birth.getMonth();
  if (years === 0) {
    const m = months < 0 ? months + 12 : months;
    return `${m} mois`;
  }
  return years === 1 ? '1 an' : `${years} ans`;
};
