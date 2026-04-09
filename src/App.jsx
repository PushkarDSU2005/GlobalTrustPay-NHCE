import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import TransactionMap from './pages/Map';
import Analytics from './pages/Analytics';
import Identity from './pages/Identity';
import Wallet from './pages/Wallet';
import Settings from './pages/Settings';
import { AnimatePresence } from 'framer-motion';
import { Web3Provider } from './context/Web3Context';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen bg-[#0f172a] flex justify-center items-center"><div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div></div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Web3Provider>
          <AnimatePresence mode="wait">
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            
            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/map" element={<TransactionMap />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/identity" element={<Identity />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
        </Web3Provider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
