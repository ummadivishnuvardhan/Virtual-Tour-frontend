import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from "../utils/constant";

const MonitoringDashboard = ({ onBack }) => {
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonitoringData();
    const interval = setInterval(fetchMonitoringData, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  const fetchMonitoringData = async () => {
    try {
      setLoading(true);
      const [healthRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/health`),
        axios.get(`${API_BASE_URL}/api/stats`)
      ]);
      setHealth(healthRes.data);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatMemory = (bytes) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  if (loading && !health) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-400 via-blue-400 to-blue-700">
        <div className="flex items-center gap-2">
          <div className="animate-spin border-2 border-white border-t-blue-500 rounded-full w-6 h-6"></div>
          <span className="text-white text-lg font-medium">Loading monitoring data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-blue-400 to-blue-700 p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <button
          className="px-4 py-2 rounded-full bg-white/30 text-white hover:bg-white/50 shadow font-semibold transition"
          onClick={onBack}
        >
          ← Back
        </button>
        <h1 className="text-white text-3xl font-bold drop-shadow-lg">System Monitoring</h1>
        <button
          className="px-4 py-2 rounded-full bg-white/30 text-white hover:bg-white/50 shadow font-semibold transition flex items-center gap-2"
          onClick={fetchMonitoringData}
        >
          <span className="text-xl">🔄</span> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Health Status */}
        <div className="col-span-1 bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 flex flex-col items-start">
          <h2 className="text-blue-800 text-lg font-bold mb-4 flex items-center gap-2">🟢 System Health</h2>
          <div className="w-full mb-2 flex justify-between text-slate-600 font-medium">
            <span>Status:</span>
            <span className={`font-bold ${health?.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
              {health?.status || 'Unknown'}
            </span>
          </div>
          <div className="w-full mb-2 flex justify-between text-slate-600">
            <span>Uptime:</span>
            <span className="font-semibold">{health ? formatUptime(health.uptime) : 'N/A'}</span>
          </div>
          <div className="w-full flex justify-between text-slate-600">
            <span>Environment:</span>
            <span className="font-semibold">{health?.environment || 'Unknown'}</span>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="col-span-1 bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 flex flex-col items-start">
          <h2 className="text-blue-800 text-lg font-bold mb-4 flex items-center gap-2">💾 Memory Usage</h2>
          {health?.memory && (
            <>
              <div className="w-full mb-2 flex justify-between text-slate-600 font-medium">
                <span>RSS:</span>
                <span className="font-semibold">{formatMemory(health.memory.rss)}</span>
              </div>
              <div className="w-full mb-2 flex justify-between text-slate-600 font-medium">
                <span>Heap Used:</span>
                <span className="font-semibold">{formatMemory(health.memory.heapUsed)}</span>
              </div>
              <div className="w-full flex justify-between text-slate-600 font-medium">
                <span>Heap Total:</span>
                <span className="font-semibold">{formatMemory(health.memory.heapTotal)}</span>
              </div>
            </>
          )}
        </div>

        {/* Application Stats */}
        <div className="col-span-1 bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 flex flex-col items-start">
          <h2 className="text-blue-800 text-lg font-bold mb-4 flex items-center gap-2">📊 Application Stats</h2>
          <div className="flex flex-col gap-3">
            <div>
              <span className="block text-2xl font-bold text-blue-800">{stats?.totalRooms || 0}</span>
              <span className="block text-xs text-slate-500 font-medium">Total Rooms</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-blue-800">VR</span>
              <span className="block text-xs text-slate-500 font-medium">Technology</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-blue-800">360°</span>
              <span className="block text-xs text-slate-500 font-medium">Experience</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-span-1 xl:col-span-1 bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 flex flex-col items-start">
          <h2 className="text-blue-800 text-lg font-bold mb-4 flex items-center gap-2">🕒 Recent Room Uploads</h2>
          {stats?.recentUploads?.length > 0 ? (
            <div className="flex flex-col gap-2 w-full">
              {stats.recentUploads.map((room, index) => (
                <div key={room._id || index} className="flex justify-between items-center w-full bg-blue-50 rounded p-2">
                  <span className="font-semibold text-blue-700">{room.roomName}</span>
                  <span className="text-xs text-slate-500">{new Date(room.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs italic text-slate-400">No recent uploads</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;
