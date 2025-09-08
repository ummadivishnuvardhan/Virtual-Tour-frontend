import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VRViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const room = location.state;

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!window.AFRAME) {
      const script = document.createElement('script');
      script.src = 'https://aframe.io/releases/1.4.0/aframe.min.js';
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  const handleExitVR = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    navigate('/rooms');
  };

  if (!room) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-700 text-white text-center">
        <h2 className="text-3xl font-semibold mb-6 opacity-80">Room not found</h2>
        <button
          onClick={() => navigate('/rooms')}
          className="bg-blue-600 rounded-full px-8 py-3 font-semibold hover:bg-blue-700 transition"
        >
          Back to Rooms
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black relative">
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 text-white z-50">
          <p className="text-2xl animate-pulse">Loading VR Experience...</p>
        </div>
      )}

      {/* VR Scene */}
      {isLoaded && (
        <a-scene embedded>
          <a-sky src={room.imageUrl} rotation="0 -130 0"></a-sky>
        </a-scene>
      )}

      {/* Exit VR Button - Small, Top Right */}
      <button
        onClick={handleExitVR}
        className="absolute top-3 right-3 z-50 bg-red-600 text-white text-lg px-3 py-1 rounded-md shadow-md hover:bg-red-700 transition"
      >
        Exit
      </button>
    </div>
  );
};

export default VRViewer;
