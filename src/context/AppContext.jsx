import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import {
  getPets, savePets,
  getTreatments, saveTreatments,
  getVaccines, saveVaccines,
  getMedical, saveMedical,
  getNotificationPrefs, saveNotificationPrefs,
} from '../utils/storage';
import {
  requestNotificationPermission,
  sendNotification,
  checkUpcomingAlerts,
  getDaysUntil,
} from '../utils/notifications';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [pets, setPets] = useState(() => getPets());
  const [treatments, setTreatments] = useState(() => getTreatments());
  const [vaccines, setVaccines] = useState(() => getVaccines());
  const [medical, setMedical] = useState(() => getMedical());
  const [notifPrefs, setNotifPrefs] = useState(() => getNotificationPrefs());
  const [alerts, setAlerts] = useState([]);

  const refreshAlerts = useCallback(() => {
    const a = checkUpcomingAlerts(treatments, vaccines, pets, notifPrefs.daysAhead || 3);
    setAlerts(a);
    return a;
  }, [treatments, vaccines, pets, notifPrefs.daysAhead]);

  useEffect(() => {
    refreshAlerts();
  }, [refreshAlerts]);

  useEffect(() => {
    if (!notifPrefs.enabled) return;
    const a = refreshAlerts();
    a.forEach((alert) => {
      const label = alert.type === 'vaccine' ? 'Vaccin' : 'Traitement';
      const msg = alert.days === 0
        ? `Aujourd'hui!`
        : `Dans ${alert.days} jour${alert.days > 1 ? 's' : ''}`;
      sendNotification(
        `🐾 ${label} - ${alert.petName}`,
        `${alert.title}: ${msg}`
      );
    });
  }, [notifPrefs.enabled]);

  const enableNotifications = async () => {
    const granted = await requestNotificationPermission();
    const prefs = { ...notifPrefs, enabled: granted };
    setNotifPrefs(prefs);
    saveNotificationPrefs(prefs);
    return granted;
  };

  // Pets
  const addPet = (petData) => {
    const pet = { ...petData, id: uuid(), createdAt: new Date().toISOString() };
    const updated = [...pets, pet];
    setPets(updated);
    savePets(updated);
    return pet;
  };

  const updatePet = (id, data) => {
    const updated = pets.map((p) => (p.id === id ? { ...p, ...data } : p));
    setPets(updated);
    savePets(updated);
  };

  const deletePet = (id) => {
    const updatedPets = pets.filter((p) => p.id !== id);
    const updatedTreatments = treatments.filter((t) => t.petId !== id);
    const updatedVaccines = vaccines.filter((v) => v.petId !== id);
    const updatedMedical = medical.filter((m) => m.petId !== id);
    setPets(updatedPets); savePets(updatedPets);
    setTreatments(updatedTreatments); saveTreatments(updatedTreatments);
    setVaccines(updatedVaccines); saveVaccines(updatedVaccines);
    setMedical(updatedMedical); saveMedical(updatedMedical);
  };

  const getPetById = (id) => pets.find((p) => p.id === id);

  // Treatments
  const addTreatment = (data) => {
    const t = { ...data, id: uuid(), createdAt: new Date().toISOString() };
    const updated = [...treatments, t];
    setTreatments(updated);
    saveTreatments(updated);
    return t;
  };

  const updateTreatment = (id, data) => {
    const updated = treatments.map((t) => (t.id === id ? { ...t, ...data } : t));
    setTreatments(updated);
    saveTreatments(updated);
  };

  const deleteTreatment = (id) => {
    const updated = treatments.filter((t) => t.id !== id);
    setTreatments(updated);
    saveTreatments(updated);
  };

  const getTreatmentsByPet = (petId) => treatments.filter((t) => t.petId === petId);

  // Vaccines
  const addVaccine = (data) => {
    const v = { ...data, id: uuid(), createdAt: new Date().toISOString() };
    const updated = [...vaccines, v];
    setVaccines(updated);
    saveVaccines(updated);
    return v;
  };

  const updateVaccine = (id, data) => {
    const updated = vaccines.map((v) => (v.id === id ? { ...v, ...data } : v));
    setVaccines(updated);
    saveVaccines(updated);
  };

  const deleteVaccine = (id) => {
    const updated = vaccines.filter((v) => v.id !== id);
    setVaccines(updated);
    saveVaccines(updated);
  };

  const getVaccinesByPet = (petId) => vaccines.filter((v) => v.petId === petId);

  // Medical
  const addMedical = (data) => {
    const m = { ...data, id: uuid(), createdAt: new Date().toISOString() };
    const updated = [...medical, m];
    setMedical(updated);
    saveMedical(updated);
    return m;
  };

  const updateMedical = (id, data) => {
    const updated = medical.map((m) => (m.id === id ? { ...m, ...data } : m));
    setMedical(updated);
    saveMedical(updated);
  };

  const deleteMedical = (id) => {
    const updated = medical.filter((m) => m.id !== id);
    setMedical(updated);
    saveMedical(updated);
  };

  const getMedicalByPet = (petId) => medical.filter((m) => m.petId === petId);

  return (
    <AppContext.Provider value={{
      pets, treatments, vaccines, medical, notifPrefs, alerts,
      addPet, updatePet, deletePet, getPetById,
      addTreatment, updateTreatment, deleteTreatment, getTreatmentsByPet,
      addVaccine, updateVaccine, deleteVaccine, getVaccinesByPet,
      addMedical, updateMedical, deleteMedical, getMedicalByPet,
      enableNotifications, refreshAlerts,
      getDaysUntil,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
