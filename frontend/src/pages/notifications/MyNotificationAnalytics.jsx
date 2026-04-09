import React, { useState, useEffect } from 'react';
import notificationService from '../../services/notificationService';
import './MyNotificationAnalytics.css';

const MyNotificationAnalytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await notificationService.getMyAnalytics();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading analytics...</div>;
    if (!stats) return <div className="error">Failed to load stats</div>;

    return (
        <div className="analytics-page">
            <h1 className="page-title">My Notification Analytics</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-label">Total Received</span>
                    <span className="stat-value">{stats.totalSent}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Total Read</span>
                    <span className="stat-value">{stats.totalRead}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Open Rate</span>
                    <span className="stat-value">{stats.openRate.toFixed(1)}%</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Avg. Open Time</span>
                    <span className="stat-value">{Math.round(stats.avgTimeToOpen)}m</span>
                </div>
            </div>

            <div className="charts-section">
                <div className="chart-container">
                    <h3>Most Active Hour</h3>
                    <p className="chart-description">Recommended delivery time for you: <strong>{stats.bestHour === -1 ? 'Immediate' : `${stats.bestHour}:00`}</strong></p>
                    <div className="bar-chart">
                        {/* Simplified representation */}
                        <div className="bar" style={{ height: '70%' }}></div>
                        <div className="bar" style={{ height: '40%' }}></div>
                    </div>
                </div>

                <div className="chart-container">
                    <h3>Type Breakdown</h3>
                    <div className="pie-chart-list">
                        {Object.entries(stats.typeBreakdown || {}).map(([type, count]) => (
                            <div key={type} className="pie-item">
                                <span className="pie-label">{type}</span>
                                <span className="pie-value">{count}</span>
                                <div className="pie-bar-bg">
                                    <div className="pie-bar-fill" style={{ width: `${(count / stats.totalSent) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyNotificationAnalytics;
