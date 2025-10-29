import React, { useState, useEffect } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  type: 'meeting' | 'call' | 'task' | 'deadline';
}

const API_BASE_URL = 'https://backend-9xl0fyi89-gem-devs-projects.vercel.app/api/v1';

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    type: 'meeting' as const,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/calendar/events`);
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data.data.events || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load events', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;

    try {
      const response = await fetch(`${API_BASE_URL}/calendar/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to add event');
      await fetchEvents();
      setFormData({ title: '', date: '', time: '', description: '', type: 'meeting' });
      setShowForm(false);
    } catch (err) {
      console.error('Error adding event:', err);
      setError('Failed to add event');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/calendar/events/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete event');
      await fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event');
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: string) => {
    return events.filter(e => e.date === date);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = getEventsForDate(dateStr);
      const isToday = new Date().toDateString() === new Date(dateStr).toDateString();

      days.push(
        <div
          key={day}
          className={`p-2 border border-nova-border dark:border-nova-border-dark rounded-lg min-h-24 ${
            isToday ? 'bg-nova-primary/10' : 'bg-nova-bg-light dark:bg-nova-bg-dark'
          }`}
        >
          <p className={`font-semibold text-sm ${isToday ? 'text-nova-primary' : 'text-nova-text-primary dark:text-nova-text-primary-dark'}`}>
            {day}
          </p>
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 2).map(event => (
              <div
                key={event.id}
                className={`text-xs px-2 py-1 rounded truncate text-white ${
                  event.type === 'meeting' ? 'bg-blue-500' :
                  event.type === 'call' ? 'bg-green-500' :
                  event.type === 'deadline' ? 'bg-red-500' :
                  'bg-purple-500'
                }`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <p className="text-xs text-nova-text-secondary dark:text-nova-text-secondary-dark">+{dayEvents.length - 2} more</p>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-nova-primary"></div>
          <p className="mt-4 text-nova-text-secondary dark:text-nova-text-secondary-dark">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-nova-text-primary dark:text-nova-text-primary-dark">Calendar</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-nova-primary text-white rounded-lg hover:bg-nova-primary/90 transition-colors"
        >
          {showForm ? 'Cancel' : 'Add Event'}
        </button>
      </div>

      {/* Add Event Form */}
      {showForm && (
        <div className="bg-nova-card dark:bg-nova-card-dark rounded-lg p-6 shadow mb-8">
          <form onSubmit={handleAddEvent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-nova-text-primary dark:text-nova-text-primary-dark mb-2">Event Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-nova-border dark:border-nova-border-dark rounded-lg bg-nova-bg-light dark:bg-nova-bg-dark text-nova-text-primary dark:text-nova-text-primary-dark"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-nova-text-primary dark:text-nova-text-primary-dark mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-nova-border dark:border-nova-border-dark rounded-lg bg-nova-bg-light dark:bg-nova-bg-dark text-nova-text-primary dark:text-nova-text-primary-dark"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-nova-text-primary dark:text-nova-text-primary-dark mb-2">Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 border border-nova-border dark:border-nova-border-dark rounded-lg bg-nova-bg-light dark:bg-nova-bg-dark text-nova-text-primary dark:text-nova-text-primary-dark"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-nova-text-primary dark:text-nova-text-primary-dark mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-nova-border dark:border-nova-border-dark rounded-lg bg-nova-bg-light dark:bg-nova-bg-dark text-nova-text-primary dark:text-nova-text-primary-dark"
                >
                  <option value="meeting">Meeting</option>
                  <option value="call">Call</option>
                  <option value="task">Task</option>
                  <option value="deadline">Deadline</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-nova-text-primary dark:text-nova-text-primary-dark mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-nova-border dark:border-nova-border-dark rounded-lg bg-nova-bg-light dark:bg-nova-bg-dark text-nova-text-primary dark:text-nova-text-primary-dark"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-nova-primary text-white rounded-lg hover:bg-nova-primary/90 transition-colors"
            >
              Save Event
            </button>
          </form>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="bg-nova-card dark:bg-nova-card-dark rounded-lg p-6 shadow mb-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="px-4 py-2 text-nova-primary hover:bg-nova-bg-light dark:hover:bg-nova-bg-dark rounded-lg transition-colors"
          >
            ← Previous
          </button>
          <h2 className="text-xl font-semibold text-nova-text-primary dark:text-nova-text-primary-dark">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="px-4 py-2 text-nova-primary hover:bg-nova-bg-light dark:hover:bg-nova-bg-dark rounded-lg transition-colors"
          >
            Next →
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-nova-text-secondary dark:text-nova-text-secondary-dark text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {renderCalendar()}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-nova-card dark:bg-nova-card-dark rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold text-nova-text-primary dark:text-nova-text-primary-dark mb-4">Upcoming Events</h2>
        <div className="space-y-3">
          {events
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 5)
            .map(event => (
              <div key={event.id} className="flex justify-between items-start p-3 bg-nova-bg-light dark:bg-nova-bg-dark rounded-lg">
                <div>
                  <p className="font-semibold text-nova-text-primary dark:text-nova-text-primary-dark">{event.title}</p>
                  <p className="text-sm text-nova-text-secondary dark:text-nova-text-secondary-dark">
                    {new Date(event.date).toLocaleDateString()} {event.time && `at ${event.time}`}
                  </p>
                  {event.description && (
                    <p className="text-sm text-nova-text-secondary dark:text-nova-text-secondary-dark mt-1">{event.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;

