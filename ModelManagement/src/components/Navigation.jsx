// src/components/Navigation.jsx
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navigation = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Model Management</Link>
      </div>
      {currentUser ? (
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          
          {currentUser.isManager ? (
            <>
              <Link to="/models">Models</Link>
              <Link to="/managers">Managers</Link>
              <Link to="/jobs">Jobs</Link>
            </>
          ) : (
            <>
              <Link to="/my-jobs">My Jobs</Link>
            </>
          )}
          
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      ) : (
        <div className="nav-links">
          <Link to="/login">Login</Link>
        </div>
      )}
    </nav>
  );
};

export default Navigation;