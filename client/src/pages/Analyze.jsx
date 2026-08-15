import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { MessageSquare, Image as ImageIcon, Link as LinkIcon, AlertCircle } from 'lucide-react';

export default function Analyze() {
  const [activeTab, setActiveTab] = useState('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDemo = async (demoText) => {
    setActiveTab('text');
    setText(demoText);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      if (activeTab === 'text') {
        if (!text) throw new Error('Please enter text to analyze');
        response = await api.post('/analyze/text', { text });
      } else if (activeTab === 'url') {
        if (!url) throw new Error('Please enter a URL to analyze');
        response = await api.post('/analyze/url', { url });
      } else if (activeTab === 'image') {
        if (!image) throw new Error('Please upload an image to analyze');
        const formData = new FormData();
        formData.append('image', image);
        response = await api.post('/analyze/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      // Navigate to result page, pass data in state
      navigate('/result', { state: { result: response.data.result, analysis: response.data.analysis } });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Analysis failed');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-[calc(100vh-73px)]">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Check Something Suspicious</h1>
        <p className="text-gray-400">Paste text, upload a screenshot, or enter a URL to let our AI assess the risk.</p>
      </div>

      <div className="bg-surface border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors flex items-center justify-center ${activeTab === 'text' ? 'border-b-2 border-primary text-primary bg-primary/5' : 'text-gray-400 hover:text-white'}`}
          >
            <MessageSquare className="w-5 h-5 mr-2" /> Text Message
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors flex items-center justify-center ${activeTab === 'image' ? 'border-b-2 border-primary text-primary bg-primary/5' : 'text-gray-400 hover:text-white'}`}
          >
            <ImageIcon className="w-5 h-5 mr-2" /> Screenshot
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors flex items-center justify-center ${activeTab === 'url' ? 'border-b-2 border-primary text-primary bg-primary/5' : 'text-gray-400 hover:text-white'}`}
          >
            <LinkIcon className="w-5 h-5 mr-2" /> URL Link
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {activeTab === 'text' && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">Message Content</label>
                <textarea
                  rows="6"
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white transition-all resize-none"
                  placeholder="Paste the suspicious message here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            )}

            {activeTab === 'image' && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">Upload Screenshot</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-xl hover:border-primary transition-colors bg-background">
                  <div className="space-y-1 text-center">
                    {preview ? (
                      <div className="mb-4">
                        <img src={preview} alt="Preview" className="mx-auto h-48 object-contain rounded" />
                      </div>
                    ) : (
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-400 justify-center">
                      <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'url' && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300">Website URL</label>
                <input
                  type="url"
                  className="w-full px-4 py-3 bg-background border border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white transition-all"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            )}

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                {loading ? (
                  <>
                    <div className="absolute inset-0 bg-blue-600/20 animate-pulse"></div>
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing...</span>
                    </div>
                  </>
                ) : (
                  'Analyze Risk'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Demo Section for Hackathon */}
      <div className="mt-12">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">Try a Demo</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <button 
            onClick={() => handleDemo("Congratulations! You have been selected for a remote job. Salary ₹18 LPA. Pay ₹1,999 registration fee.")}
            className="px-4 py-2 bg-surface hover:bg-gray-800 border border-gray-700 rounded-lg text-sm transition-colors"
          >
            Fake Job
          </button>
          <button 
            onClick={() => handleDemo("Your bank account will be blocked today. Verify immediately: http://suspicious-link.example")}
            className="px-4 py-2 bg-surface hover:bg-gray-800 border border-gray-700 rounded-lg text-sm transition-colors"
          >
            Bank Phishing
          </button>
          <button 
            onClick={() => handleDemo("Congratulations! You won ₹25 lakh. Pay ₹500 processing fee.")}
            className="px-4 py-2 bg-surface hover:bg-gray-800 border border-gray-700 rounded-lg text-sm transition-colors"
          >
            Lottery Scam
          </button>
          <button 
            onClick={() => handleDemo("Hey, are we still meeting at 5 PM?")}
            className="px-4 py-2 bg-surface hover:bg-gray-800 border border-gray-700 rounded-lg text-sm transition-colors"
          >
            Normal Message
          </button>
        </div>
      </div>
    </div>
  );
}
