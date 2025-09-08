import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import API_BASE_URL from "../utils/constant";
import { ADMIN_EMAILS } from "../utils/config";

const RoomsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useUser();
  const isAdmin = user && ADMIN_EMAILS.includes(user.primaryEmailAddress?.emailAddress);

  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [includeInactive] = useState(true);

  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const deptFromUrl = searchParams.get("department");
    if (deptFromUrl) {
      setSelectedDepartment(deptFromUrl);
    } else {
      setSelectedDepartment("CSE");
      const params = new URLSearchParams(window.location.search);
      params.set("department", "CSE");
      navigate(`/rooms?${params.toString()}`, { replace: true });
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    fetchRooms();
  }, [includeInactive]);

  useEffect(() => {
    let filtered = [...rooms];

    if (selectedDepartment && selectedDepartment !== "all") {
      filtered = filtered.filter((r) => r.department === selectedDepartment);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (r.description || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.roomName.localeCompare(b.roomName));
    }

    setFilteredRooms(filtered);
  }, [rooms, selectedDepartment, searchTerm, sortBy]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        `${API_BASE_URL}/rooms?includeInactive=${includeInactive}`
      );
      if (response.data.success) {
        setRooms(response.data.data);
      } else {
        setError("Failed to load rooms");
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (room) => {
    navigate("/vr", {
      state: {
        imageUrl: room.url,
        roomName: room.roomName,
        department: room.department,
      },
    });
  };

  const handleDeleteAction = async (roomId, action) => {
    try {
      if (action === "delete") {
        if (!window.confirm("Are you sure you want to delete this room?")) return;
        await axios.delete(`${API_BASE_URL}/rooms/${roomId}`);
      } else if (action === "inactive") {
        await axios.patch(`${API_BASE_URL}/rooms/${roomId}/deactivate`);
      } else if (action === "restore") {
        await axios.patch(`${API_BASE_URL}/rooms/${roomId}/restore`);
      }
      fetchRooms();
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
      alert(`Failed to ${action} room`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12"></div>
        <span className="ml-4 text-lg text-gray-700">Loading rooms...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      {/* Header: Remove the blue gradient */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <button
          onClick={() => navigate("/")}
          className="text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 font-semibold transition-transform duration-200 transform hover:scale-105 rounded-lg px-3 py-2 shadow-md"
        >
          ← Back to Home
        </button>

        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Available Rooms in {selectedDepartment.toUpperCase()}
          </h1>
          <p className="text-blue-600 font-medium tracking-wide">Virtual Reality Tour</p>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
        <input
          type="text"
          placeholder="Search rooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full sm:w-1/3 shadow focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-4 py-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name (A–Z)</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded relative mb-6 flex items-center justify-between shadow-md">
          <span>{error}</span>
          <button
            onClick={fetchRooms}
            className="text-red-700 underline font-semibold hover:text-red-900 ml-4"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredRooms.length === 0 && !error && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 text-gray-400 animate-bounce">🏛️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No rooms available</h2>
          <p className="text-gray-500 mb-6">Get started by adding your first panorama room</p>
          {isAdmin && (
            <div className="flex justify-center">
              <button
                onClick={() => navigate("/admin")}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-cyan-500 hover:to-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 font-bold"
              >
                Add New Room
              </button>
            </div>
          )}
        </div>
      )}

      {/* Rooms Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredRooms.map((room, index) => (
          <div
            key={room._id}
            onClick={() => handleRoomClick(room)}
            style={{ animationDelay: `${index * 0.1}s` }}
            className="relative bg-white shadow-xl border-2 border-transparent hover:border-blue-400 rounded-xl cursor-pointer hover:shadow-2xl hover:scale-105 transform transition-all duration-200 flex flex-col group"
          >
            <div className="relative h-48 w-full rounded-t-xl overflow-hidden">
              <img
                src={room.url || "/room-placeholder.jpg"}
                alt={room.roomName}
                loading="lazy"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-transparent bg-opacity-40 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl scale-95 group-hover:scale-100">
                <div className="text-4xl mb-1 animate-bounce">🥽</div>
                <span className="text-white font-semibold tracking-wide">View in VR</span>
              </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900 truncate">{room.roomName}</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full shadow-sm">
                  {room.department}
                </span>
              </div>
              <p className="text-gray-600 text-sm flex-grow">
                {room.description || "Experience this space in 360° virtual reality"}
              </p>
              <div className="flex justify-between mt-4 text-xs text-gray-400 font-mono">
                <span>Added {new Date(room.createdAt).toLocaleDateString()}</span>
                <span>360° Panorama</span>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex flex-wrap gap-2 justify-between items-center">
              {room.isActive && (
                <button className="explore-btn bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition w-full sm:w-auto font-bold hover:scale-105 duration-150">
                  <span>Explore Room</span>
                  <span className="ml-2 text-xl">→</span>
                </button>
              )}

              {/* Admin-only actions */}
              {isAdmin && (
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-end w-full sm:w-auto">
                  <button
                    className="action-btn bg-red-100 text-red-600 hover:bg-gradient-to-r hover:from-red-300 hover:to-red-500 hover:text-white rounded-md px-3 py-1 text-sm transition-transform duration-200 transform hover:scale-110 font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAction(room._id, "delete");
                    }}
                  >
                    🗑 Delete
                  </button>
                  {room.isActive ? (
                    <button
                      className="action-btn bg-gray-100 text-gray-600 hover:bg-gradient-to-r hover:from-zinc-300 hover:to-zinc-500 hover:text-white rounded-md px-3 py-1 text-sm transition-transform duration-200 transform hover:scale-110"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAction(room._id, "inactive");
                      }}
                    >
                      🚫 Inactive
                    </button>
                  ) : (
                    <button
                      className="action-btn bg-green-100 text-green-700 hover:bg-gradient-to-r hover:from-green-300 hover:to-green-500 hover:text-white rounded-md px-3 py-1 text-sm transition-transform duration-200 transform hover:scale-110 font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAction(room._id, "restore");
                      }}
                    >
                      ♻️ Restore
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Button (Admin only) */}
      {isAdmin && (
        <button
          onClick={() => navigate("/admin")}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white rounded-full w-14 h-14 text-3xl shadow-2xl flex justify-center items-center transition-all duration-300 animate-pulse border-4 border-white"
          aria-label="Add New Room"
        >
          +
        </button>
      )}
    </div>
  );
};

export default RoomsPage;
