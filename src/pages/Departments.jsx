import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/departments")
      .then(res => res.json())
      .then(data => setDepartments(data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Departments</h2>
      <div className="grid gap-4">
        {departments.map(dep => (
          <div
            key={dep._id}
            onClick={() => navigate(`/departments/${dep._id}`)}
            className="p-4 bg-blue-100 hover:bg-blue-200 rounded cursor-pointer"
          >
            {dep.name}
          </div>
        ))}
      </div>
    </div>
  );
}
