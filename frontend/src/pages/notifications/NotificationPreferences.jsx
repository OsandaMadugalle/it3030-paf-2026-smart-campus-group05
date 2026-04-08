import React, { useState, useEffect } from 'react';
import notificationService from '../../services/notificationService';
import './NotificationPreferences.css';

const NotificationPreferences = () => {
  const [prefs, setPrefs] = useState({
    bookingNotifications: true,
    announcementNotifications: true,
    systemNotifications: true,
    digestMode: false,
    digestIntervalHours: 1,
    preferredDeliveryHour: -1
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchPrefs();
  }, []);

  const fetchPrefs = async () => {
    try {
      const data = await notificationService.getMyPreferences();
      if (data) setPrefs(data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await notificationService.updateMyPreferences(prefs);
      setMessage({ type: 'success', text: 'Preferences saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving preferences' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading settings...</div>;

  return (
    <div className="preferences-page">
      <div className="settings-card">
        <div className="card-header">
          <h2>Notification Settings</h2>
          <p>Control how and when you receive notifications</p>
        </div>

        <div className="settings-section">
          <h3>Delivery Subscriptions</h3>
          <div className="toggle-item">
            <div className="toggle-info">
              <label>Booking Updates</label>
              <p>Receive alerts for approved, rejected or cancelled bookings</p>
            </div>
            <input 
              type="checkbox" 
              checked={prefs.bookingNotifications}
              onChange={(e) => setPrefs({...prefs, bookingNotifications: e.target.checked})}
            />
          </div>

          <div className="toggle-item">
            <div className="toggle-info">
              <label>Announcements</label>
              <p>Updates about campus news and important alerts</p>
            </div>
            <input 
              type="checkbox" 
              checked={prefs.announcementNotifications}
              onChange={(e) => setPrefs({...prefs, announcementNotifications: e.target.checked})}
            />
          </div>

          <div className="toggle-item">
            <div className="toggle-info">
              <label>System Alerts</label>
              <p>Technical updates and platform maintenance notices</p>
            </div>
            <input 
              type="checkbox" 
              checked={prefs.systemNotifications}
              onChange={(e) => setPrefs({...prefs, systemNotifications: e.target.checked})}
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>Intelligent Delivery</h3>
          <div className="toggle-item">
            <div className="toggle-info">
              <label>Digest Mode</label>
              <p>Group notifications together to avoid multiple alerts</p>
            </div>
            <input 
              type="checkbox" 
              checked={prefs.digestMode}
              onChange={(e) => setPrefs({...prefs, digestMode: e.target.checked})}
            />
          </div>

          {prefs.digestMode && (
            <div className="input-item">
              <label>Digest Interval</label>
              <select 
                value={prefs.digestIntervalHours}
                onChange={(e) => setPrefs({...prefs, digestIntervalHours: parseInt(e.target.value)})}
              >
                <option value={1}>Every Hour</option>
                <option value={2}>Every 2 Hours</option>
                <option value={4}>Every 4 Hours</option>
                <option value={24}>Daily Summary</option>
              </select>
            </div>
          )}

          <div className="input-item">
            <label>Preferred Delivery Hour (0-23)</label>
            <p className="hint">Set to -1 for immediate delivery</p>
            <input 
              type="number" 
              min="-1" 
              max="23" 
              value={prefs.preferredDeliveryHour}
              onChange={(e) => setPrefs({...prefs, preferredDeliveryHour: parseInt(e.target.value)})}
            />
          </div>
        </div>

        {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

        <div className="card-footer">
          <button 
            className="save-btn" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
