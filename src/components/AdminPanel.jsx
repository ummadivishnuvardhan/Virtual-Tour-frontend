import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../utils/constant";

const AdminPanel = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [formData, setFormData] = useState({
    roomName: "",
    description: "",
    department: "",
    panoramaImage: null,
  });

  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/rooms`);
      if (response.data.success) {
        setRooms(response.data.data);
      } else {
        showMessage("Failed to load rooms", "error");
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
      showMessage("Failed to load rooms", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showMessage("Please select an image file", "error");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        showMessage("File size must be less than 10MB", "error");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        panoramaImage: file,
      }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.roomName.trim() || !formData.department.trim()) {
      showMessage("Room name and department are required", "error");
      return;
    }
    if (!formData.panoramaImage) {
      showMessage("Please select a panorama image", "error");
      return;
    }

    try {
      setUploading(true);
      const uploadData = new FormData();
      uploadData.append("panoramaImage", formData.panoramaImage);
      uploadData.append("roomName", formData.roomName.trim());
      uploadData.append("description", formData.description.trim());
      uploadData.append("department", formData.department.trim());

      const response = await axios.post(`${API_BASE_URL}/upload`, uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        showMessage("Room uploaded successfully!", "success");
        setFormData({
          roomName: "",
          description: "",
          department: "",
          panoramaImage: null,
        });
        setPreviewUrl("");
        fetchRooms();
        const fileInput = document.getElementById("panoramaImage");
        if (fileInput) fileInput.value = "";
      } else {
        showMessage(response.data.error || "Upload failed", "error");
      }
    } catch (err) {
      showMessage(err.response?.data?.error || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (roomId, roomName) => {
    if (!window.confirm(`Are you sure you want to delete "${roomName}"?`)) return;
    try {
      const response = await axios.delete(`${API_BASE_URL}/rooms/${roomId}`);
      if (response.data.success) {
        showMessage("Room deleted successfully", "success");
        fetchRooms();
      } else {
        showMessage(response.data.error || "Delete failed", "error");
      }
    } catch (err) {
      showMessage(err.response?.data?.error || "Delete failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-12 flex flex-col max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-10 gap-4">
        <button
          className="py-2 px-5 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition font-semibold"
          onClick={() => navigate("/rooms")}
        >
          ← Back to Rooms
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-blue-900">Admin Panel</h1>
          <p className="text-gray-500 mt-1">Manage VR Rooms Efficiently</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Upload Form */}
        <section className="md:w-2/5 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Add New Room</h2>
          <p className="text-gray-600 mb-6">
            Upload a 360° panorama image to create a new VR room.
          </p>

          {message && (
            <div
              className={`mb-5 px-4 py-3 rounded-md text-sm font-medium ${
                messageType === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="roomName" className="block font-medium text-gray-700 mb-1">
                Room Name *
              </label>
              <input
                type="text"
                id="roomName"
                name="roomName"
                value={formData.roomName}
                onChange={handleInputChange}
                placeholder="e.g., Computer Lab 1"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>

            <div>
              <label htmlFor="department" className="block font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              >
                <option value="">-- Select Department --</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="ME">Mechanical</option>
                <option value="CE">Civil</option>
                <option value="IT">IT</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label htmlFor="panoramaImage" className="block font-medium text-gray-700 mb-1">
                Panorama Image * (Max 10MB)
              </label>
              <input
                type="file"
                id="panoramaImage"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm"
                required
              />
              {previewUrl && (
                <div className="mt-3 relative rounded-md overflow-hidden border border-gray-200">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-28 object-cover"
                  />
                  <span className="absolute top-2 right-2 bg-white/80 px-2 py-1 rounded-md text-xs text-gray-700">
                    Preview
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md py-3 transition flex items-center justify-center gap-2"
            >
              {uploading ? (
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                </svg>
              ) : (
                "Upload Room"
              )}
            </button>
          </form>
        </section>

        {/* Rooms Management Table */}
        <section className="md:w-3/5 bg-white rounded-xl shadow-lg p-8 overflow-x-auto">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            Manage Rooms ({rooms.length})
          </h2>
          <p className="text-gray-600 mb-6">View and manage existing VR rooms</p>

          {loading ? (
            <div className="flex justify-center py-10 text-blue-600">
              <svg
                className="animate-spin w-8 h-8 mr-3"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </svg>
              Loading rooms...
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">🏛️</div>
              <div className="font-semibold mb-2">No rooms yet</div>
              <div className="text-sm">Upload your first panorama room above</div>
            </div>
          ) : (
            <table className="min-w-full text-sm table-fixed border-collapse">
              <thead>
                <tr className="bg-blue-50 text-blue-700 font-medium">
                  <th className="p-3 rounded-tl-lg w-24">Preview</th>
                  <th className="p-3">Room Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 w-32">Added</th>
                  <th className="p-3 rounded-tr-lg w-28">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr
                    key={room._id}
                    className="border-b hover:bg-blue-100 transition"
                  >
                    <td className="p-2">
                      <img
                        src={room.url}
                        alt={room.roomName}
                        className="h-12 w-20 rounded-md object-cover border border-gray-300"
                      />
                    </td>
                    <td className="p-2 font-semibold text-blue-900">{room.roomName}</td>
                    <td className="p-2 text-blue-800 whitespace-nowrap">
                      {room.department || "N/A"}
                    </td>
                    <td className="p-2 text-gray-600 truncate max-w-xs">
                      {room.description || "No description"}
                    </td>
                    <td className="p-2 text-gray-400 whitespace-nowrap">
                      {new Date(room.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-2 justify-center">
                        <button
                          className="p-2 bg-blue-100 rounded hover:bg-blue-200 text-blue-700 transition"
                          title="View Image"
                          onClick={() => window.open(room.url, "_blank")}
                          aria-label={`View image of ${room.roomName}`}
                        >
                          👁️
                        </button>
                        <button
                          className="p-2 bg-red-100 rounded hover:bg-red-200 text-red-700 transition"
                          title="Delete Room"
                          onClick={() => handleDelete(room._id, room.roomName)}
                          aria-label={`Delete room ${room.roomName}`}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;
