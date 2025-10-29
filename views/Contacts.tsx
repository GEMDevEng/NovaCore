import React, { useState, useEffect } from 'react';

interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  source: string;
  rating?: string;
  createdAt: string;
}

const API_BASE_URL = 'https://backend-7xma19lfx-gem-devs-projects.vercel.app/api/v1';

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    source: 'web',
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/leads`);
      if (!response.ok) throw new Error('Failed to fetch contacts');
      const data = await response.json();
      setContacts(data.data.leads || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to add contact');
      await fetchContacts();
      setFormData({ name: '', email: '', company: '', phone: '', source: 'web' });
      setShowForm(false);
    } catch (err) {
      console.error('Error adding contact:', err);
      setError('Failed to add contact');
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leads/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete contact');
      await fetchContacts();
    } catch (err) {
      console.error('Error deleting contact:', err);
      setError('Failed to delete contact');
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = selectedSource === 'all' || contact.source === selectedSource;
    return matchesSearch && matchesSource;
  });

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-nova-primary"></div>
          <p className="mt-4 text-nova-text-secondary dark:text-nova-text-secondary-dark">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-nova-text-primary dark:text-nova-text-primary-dark">Contacts</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-nova-primary text-white rounded-lg hover:bg-nova-primary/90 transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Contact'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Add Contact Form */}
      {showForm && (
        <div className="bg-nova-card dark:bg-nova-card-dark rounded-lg p-6 shadow mb-8">
          <form onSubmit={handleAddContact} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-nova-text-primary dark:text-nova-text-primary-dark mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-nova-border dark:border-nova-border-dark rounded-lg bg-nova-bg-light dark:bg-nova-bg-dark text-nova-text-primary dark:text-nova-text-primary-dark"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-nova-text-primary dark:text-nova-text-primary-dark mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-nova-border dark:border-nova-border-dark rounded-lg bg-nova-bg-light dark:bg-nova-bg-dark text-nova-text-primary dark:text-nova-text-primary-dark"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-nova-text-primary dark:text-nova-text-primary-dark mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 border border-nova-border dark:border-nova-border-dark rounded-lg bg-nova-bg-light dark:bg-nova-bg-dark text-nova-text-primary dark:text-nova-text-primary-dark"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-nova-text-primary dark:text-nova-text-primary-dark mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-nova-border dark:border-nova-border-dark rounded-lg bg-nova-bg-light dark:bg-nova-bg-dark text-nova-text-primary dark:text-nova-text-primary-dark"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-nova-text-primary dark:text-nova-text-primary-dark mb-2">Source</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-4 py-2 border border-nova-border dark:border-nova-border-dark rounded-lg bg-nova-bg-light dark:bg-nova-bg-dark text-nova-text-primary dark:text-nova-text-primary-dark"
                >
                  <option value="web">Web</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="referral">Referral</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-nova-primary text-white rounded-lg hover:bg-nova-primary/90 transition-colors"
            >
              Save Contact
            </button>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-nova-card dark:bg-nova-card-dark rounded-lg p-6 shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-nova-border dark:border-nova-border-dark rounded-lg bg-nova-bg-light dark:bg-nova-bg-dark text-nova-text-primary dark:text-nova-text-primary-dark placeholder-nova-text-secondary"
            />
          </div>
          <div>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-4 py-2 border border-nova-border dark:border-nova-border-dark rounded-lg bg-nova-bg-light dark:bg-nova-bg-dark text-nova-text-primary dark:text-nova-text-primary-dark"
            >
              <option value="all">All Sources</option>
              <option value="web">Web</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="referral">Referral</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-nova-card dark:bg-nova-card-dark rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-nova-bg-light dark:bg-nova-bg-dark border-b border-nova-border dark:border-nova-border-dark">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-nova-text-primary dark:text-nova-text-primary-dark">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-nova-text-primary dark:text-nova-text-primary-dark">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-nova-text-primary dark:text-nova-text-primary-dark">Company</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-nova-text-primary dark:text-nova-text-primary-dark">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-nova-text-primary dark:text-nova-text-primary-dark">Source</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-nova-text-primary dark:text-nova-text-primary-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="border-b border-nova-border dark:border-nova-border-dark hover:bg-nova-bg-light dark:hover:bg-nova-bg-dark transition-colors">
                  <td className="px-6 py-4 text-nova-text-primary dark:text-nova-text-primary-dark font-medium">{contact.name}</td>
                  <td className="px-6 py-4 text-nova-text-secondary dark:text-nova-text-secondary-dark">{contact.email}</td>
                  <td className="px-6 py-4 text-nova-text-primary dark:text-nova-text-primary-dark">{contact.company}</td>
                  <td className="px-6 py-4 text-nova-text-secondary dark:text-nova-text-secondary-dark">{contact.phone || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-nova-primary/10 text-nova-primary rounded-full text-sm capitalize">
                      {contact.source}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-nova-text-secondary dark:text-nova-text-secondary-dark">No contacts found</p>
        </div>
      )}

      <div className="mt-4 text-sm text-nova-text-secondary dark:text-nova-text-secondary-dark">
        Showing {filteredContacts.length} of {contacts.length} contacts
      </div>
    </div>
  );
};

export default Contacts;

