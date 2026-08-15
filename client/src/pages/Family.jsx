import { useState, useEffect } from 'react';
import api from '../api';
import { Heart, UserPlus, Trash2, Shield } from 'lucide-react';

export default function Family() {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data } = await api.get('/family');
      setMembers(data);
    } catch (error) {
      console.error('Failed to fetch family members', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post('/family', { name, relationship, email });
      setName('');
      setRelationship('');
      setEmail('');
      fetchMembers();
    } catch (error) {
      console.error('Failed to add member', error);
    }
  };

  const handleRemoveMember = async (id) => {
    try {
      await api.delete(`/family/${id}`);
      fetchMembers();
    } catch (error) {
      console.error('Failed to remove member', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-[calc(100vh-73px)]">
      <div className="text-center mb-10">
        <Heart className="mx-auto h-12 w-12 text-pink-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Family Safety Mode</h1>
        <p className="text-gray-400">Add trusted family members to share suspicious messages and keep them protected.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-surface rounded-xl border border-gray-800 p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <UserPlus className="h-5 w-5 mr-2 text-primary" /> Add Member
            </h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg focus:ring-1 focus:ring-primary outline-none text-white text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Relationship</label>
                <select
                  required
                  className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg focus:ring-1 focus:ring-primary outline-none text-white text-sm appearance-none"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                >
                  <option value="" disabled>Select relationship</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Grandparent">Grandparent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Child">Child</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg focus:ring-1 focus:ring-primary outline-none text-white text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors"
              >
                Add to Family
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-surface rounded-xl border border-gray-800 p-6 shadow-lg h-full">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-400" /> Trusted Contacts
            </h3>
            
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : members.length > 0 ? (
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member._id} className="flex items-center justify-between p-4 bg-background border border-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-bold text-white">{member.name}</h4>
                      <p className="text-sm text-gray-400">{member.relationship} {member.email && `• ${member.email}`}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border-2 border-dashed border-gray-800 rounded-xl">
                <Heart className="mx-auto h-8 w-8 text-gray-600 mb-2" />
                <p className="text-gray-400 text-sm">No family members added yet.</p>
                <p className="text-gray-500 text-xs mt-1">Add them to easily share scam alerts.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
