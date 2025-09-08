import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await signup(name, email, password);
      navigate("/login"); // Navigate to login page after successful signup
    } catch (error) {
      setError("Signup failed. Please try again.");
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <input 
          type="text" 
          placeholder="Name" 
          className="w-full mb-3 p-2 border rounded"
          value={name} 
          onChange={e => setName(e.target.value)}
          required
          disabled={isLoading}
        />
        
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full mb-3 p-2 border rounded"
          value={email} 
          onChange={e => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full mb-3 p-2 border rounded"
          value={password} 
          onChange={e => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        
        <button 
          type="submit" 
          className="w-full bg-yellow-400 text-blue-900 py-2 rounded hover:bg-yellow-500 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>
        
        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Login here
          </button>
        </div>
      </form>
    </div>
  );
}