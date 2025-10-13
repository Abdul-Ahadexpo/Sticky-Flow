import { useState } from 'react';
import HomePage from './components/HomePage';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleAdminLogin = () => {
    setIsAdmin(true);
    setShowAdminLogin(false);
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  if (showAdminLogin) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  if (isAdmin) {
    return <AdminPanel onLogout={handleLogout} />;
  }

  return (
    <div>
      <HomePage />
      <button
        onClick={() => setShowAdminLogin(true)}
        className="fixed bottom-4 right-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-lg text-sm opacity-50 hover:opacity-100 transition-opacity"
      >
        Admin
      </button>
    </div>
  );
}

export default App;