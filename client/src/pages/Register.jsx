import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { ShieldCheck } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-73px)] py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-surface p-10 rounded-2xl border border-gray-800 shadow-2xl">
        <div className="text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-extrabold text-white">Create an account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Join ScamSaarthi to keep yourself and your family safe
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm">{error}</div>}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            Create Account
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-blue-400 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
