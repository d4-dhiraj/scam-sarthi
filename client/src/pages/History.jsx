import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { ShieldAlert, ShieldCheck, AlertTriangle, ArrowRight, Clock } from 'lucide-react';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/analyze');
        setHistory(data);
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getRiskIcon = (score) => {
    if (score > 60) return <ShieldAlert className="h-6 w-6 text-danger" />;
    if (score > 20) return <AlertTriangle className="h-6 w-6 text-warning" />;
    return <ShieldCheck className="h-6 w-6 text-success" />;
  };

  const getRiskColor = (score) => {
    if (score > 60) return 'text-danger';
    if (score > 20) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-[calc(100vh-73px)]">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analysis History</h1>
          <p className="text-gray-400">Review your past security checks.</p>
        </div>
        <Link to="/analyze/text" className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-medium transition-colors">
          New Check
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item._id} className="bg-surface border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-4">
                <div className="mt-1 bg-background p-2 rounded-lg border border-gray-800">
                  {getRiskIcon(item.riskScore)}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`font-bold ${getRiskColor(item.riskScore)}`}>{item.riskLevel}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-sm text-gray-400 capitalize">{item.category?.replace('_', ' ').toLowerCase()}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-sm text-gray-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-2 mt-2 font-mono bg-background/50 p-2 rounded border border-gray-800/50">
                    {item.inputType === 'text' ? item.inputText : item.inputType === 'url' ? item.url : 'Image Analysis'}
                  </p>
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                <div className="text-2xl font-black mb-1">{item.riskScore}<span className="text-sm font-normal text-gray-500">/100</span></div>
                <Link to="/result" state={{ result: item }} className="flex items-center text-sm text-primary hover:text-blue-400 font-medium">
                  View Details <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 border-2 border-dashed border-gray-800 rounded-2xl">
          <ShieldCheck className="mx-auto h-12 w-12 text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-300 mb-2">No history found</h3>
          <p className="text-gray-500 mb-6">You haven't checked any messages or websites yet.</p>
          <Link to="/analyze/text" className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors">
            Start Your First Analysis
          </Link>
        </div>
      )}
    </div>
  );
}
