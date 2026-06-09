const KEYS = {
  PETS: 'pico_pets',
  TREATMENTS: 'pico_treatments',
  VACCINES: 'pico_vaccines',
  MEDICAL: 'pico_medical',
  NOTIFICATIONS: 'pico_notifications',
};

const get = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const set = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
};

export const getPets = () => get(KEYS.PETS);
export const savePets = (pets) => set(KEYS.PETS, pets);

export const getTreatments = () => get(KEYS.TREATMENTS);
export const saveTreatments = (t) => set(KEYS.TREATMENTS, t);

export const getVaccines = () => get(KEYS.VACCINES);
export const saveVaccines = (v) => set(KEYS.VACCINES, v);

export const getMedical = () => get(KEYS.MEDICAL);
export const saveMedical = (m) => set(KEYS.MEDICAL, m);

export const getNotificationPrefs = () => {
  try {
    const data = localStorage.getItem(KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : { enabled: false, daysAhead: 3 };
  } catch {
    return { enabled: false, daysAhead: 3 };
  }
};

export const saveNotificationPrefs = (prefs) =>
  set(KEYS.NOTIFICATIONS, prefs);
