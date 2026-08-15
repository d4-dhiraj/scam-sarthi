import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-surface border-b border-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <ShieldCheck className="text-primary h-8 w-8" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-primary">
            ScamSaarthi
          </span>
        </Link>

        <div className="flex items-center space-x-6">
          <Link to="/analyze/text" className="text-gray-300 hover:text-white transition-colors">Check</Link>
          {token ? (
            <>
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
              <Link to="/history" className="text-gray-300 hover:text-white transition-colors">History</Link>
              <Link to="/family" className="text-gray-300 hover:text-white transition-colors">Family Safety</Link>
              <div className="flex items-center space-x-4 pl-4 border-l border-gray-700">
                <span className="flex items-center text-sm text-gray-400">
                  <User className="h-4 w-4 mr-1" />
                  {user?.name}
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
