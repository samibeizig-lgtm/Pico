import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import PetList from './pages/PetList';
import PetDetail from './pages/PetDetail';
import AddEditPet from './pages/AddEditPet';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pets" element={<PetList />} />
          <Route path="/pets/add" element={<AddEditPet />} />
          <Route path="/pets/:id/edit" element={<AddEditPet />} />
          <Route path="/pets/:id" element={<PetDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Navigation />
      </BrowserRouter>
    </AppProvider>
  );
}
