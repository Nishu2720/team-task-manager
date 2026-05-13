import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout    from './components/Layout';
import AuthPage  from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Projects  from './pages/Projects';
import Tasks     from './pages/Tasks';
import Team      from './pages/Team';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen gap-3 text-white/30 text-sm"
      style={{ background: '#020209' }}>
      <span className="spinner" style={{ width: 20, height: 20 }} />
      <span>Loading TaskFlow…</span>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen" style={{ background: '#020209' }} />;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login"  element={<PublicRoute><AuthPage mode="login"  /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><AuthPage mode="signup" /></PublicRoute>} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index            element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects"  element={<Projects />} />
        <Route path="tasks"     element={<Tasks />} />
        <Route path="team"      element={<Team />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
