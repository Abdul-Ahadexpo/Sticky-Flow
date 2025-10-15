import { useState, useEffect } from 'react';
import { ref, set } from 'firebase/database';
import { database } from './firebase';
import HomePage from './components/HomePage';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import NameEntryModal from './components/NameEntryModal';
import { collectDeviceData, hasVisitorConsented, setVisitorConsented, getStoredVisitorId, setStoredVisitorId } from './utils/visitorData';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const consented = hasVisitorConsented();
    setHasConsented(consented);
  }, []);

  const handleAdminLogin = () => {
    setIsAdmin(true);
    setShowAdminLogin(false);
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const handleVisitorSubmit = async (name: string, consentGeo: boolean) => {
    setIsSubmitting(true);

    try {
      const visitorData = await collectDeviceData(name, consentGeo);

      const visitorsRef = ref(database, `visitors/${visitorData.id}`);
      await set(visitorsRef, visitorData);

      setStoredVisitorId(visitorData.id!);
      setVisitorConsented();
      setHasConsented(true);

      const storedName = localStorage.getItem('visitorName');
      if (!storedName) {
        localStorage.setItem('visitorName', name);
      }
    } catch (error) {
      console.error('Error saving visitor data:', error);
      alert('There was an error processing your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showAdminLogin) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  if (isAdmin) {
    return <AdminPanel onLogout={handleLogout} />;
  }

  if (!hasConsented) {
    return <NameEntryModal onSubmit={handleVisitorSubmit} isSubmitting={isSubmitting} />;
  }

  return (
    <div>
      <HomePage />
      <button
        onClick={() => setShowAdminLogin(true)}
        className="fixed bottom-4 right-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-lg text-sm opacity-50 hover:opacity-100 transition-opacity z-50"
      >
        Admin
      </button>
    </div>
  );
}

export default App;