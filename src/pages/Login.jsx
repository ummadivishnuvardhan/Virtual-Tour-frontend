import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await login(email, password);
      navigate("/"); // Navigate to home page after successful login
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
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
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        
        <div className="mt-4 text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Sign up here
          </button>
        </div>
      </form>
    </div>
  );
}