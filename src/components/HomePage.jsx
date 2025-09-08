import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const departments = [
  { name: "CSE", icon: "💻", description: "Explore Computer Science classrooms, labs, and facilities" },
  { name: "ECE", icon: "📡", description: "Experience Electronics and Communication labs & research areas" },
  { name: "MECH", icon: "⚙️", description: "Tour Mechanical workshops, projects, and classrooms" },
  { name: "CIVIL", icon: "🏗️", description: "Walk through Civil Engineering labs and structural projects" },
  { name: "CHEM", icon: "🧪", description: "Discover Chemical Engineering labs and experiments" },
  { name: "MET", icon: "🔩", description: "Explore Metallurgy research and lab facilities" },
  { name: "EEE", icon: "⚡", description: "Experience Electrical Engineering labs and classrooms" },
  { name: "CC", icon: "🖥️", description: "Visit the Computer Center and advanced IT labs" },
];

const gradientColors = [
  "from-pink-400 to-red-500",
  "from-purple-400 to-indigo-600",
  "from-blue-500 to-teal-500",
  "from-green-400 to-emerald-600",
  "from-yellow-400 to-amber-500",
  "from-orange-400 to-red-400",
  "from-cyan-400 to-blue-600",
  "from-pink-400 to-purple-600",
];

const featureHighlights = [
  "Immersive 360° VR Tours",
  "Cutting-Edge Lab Facilities",
  "Expert Faculty and Research",
  "Innovative Projects & Workshops",
  "State-of-the-Art Classrooms",
  "Collaborative Student Environment",
  "Industry-Ready Skill Development",
];

const accentColors = [
  "text-amber-400",
  "text-pink-500",
  "text-purple-500",
  "text-blue-400",
  "text-green-400",
  "text-yellow-400",
  "text-red-400",
];

const HomePage = () => {
  const navigate = useNavigate();
  const departmentsRef = useRef(null);

  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [fadeState, setFadeState] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState(false);
      setTimeout(() => {
        setCurrentFeatureIndex((prev) => (prev + 1) % featureHighlights.length);
        setFadeState(true);
      }, 700);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleDepartmentClick = (deptName) => {
    const departmentMapping = {
      CSE: "CSE",
      ECE: "ECE",
      MECH: "ME",
      CIVIL: "CE",
      CHEM: "CHEM",
      MET: "MET",
      EEE: "EEE",
      CC: "CC",
    };
    const mappedDept = departmentMapping[deptName] || deptName;
    navigate(`/rooms?department=${mappedDept}`);
  };

  const scrollToDepartments = () => {
    if (departmentsRef.current) {
      departmentsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap"
        rel="stylesheet"
      />

      <main
        className="min-h-screen w-full bg-gradient-to-br from-indigo-100 to-white font-sans select-none flex flex-col items-center"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Hero Section */}
        <section className="relative w-full bg-gradient-to-r from-blue-900 via-cyan-700 to-blue-800 text-white flex flex-col items-center justify-center text-center overflow-hidden px-6 py-24 md:py-32 shadow-2xl">
          {/* Animated Background Blobs */}
          <div className="absolute top-10 left-10 w-28 h-28 bg-blue-500 rounded-full opacity-20 animate-blob mix-blend-multiply filter blur-xl animation-delay-2000"></div>
          <div className="absolute top-32 right-12 w-40 h-40 bg-cyan-400 rounded-full opacity-25 animate-blob mix-blend-multiply filter blur-2xl animation-delay-4000"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-blue-600 rounded-full opacity-20 animate-blob mix-blend-multiply filter blur-xl animation-delay-3000"></div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight max-w-4xl drop-shadow-lg">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
              Our College
            </span>
          </h1>
          <p
            className={`text-lg md:text-2xl max-w-3xl mb-12 font-semibold tracking-wide leading-relaxed transition-opacity duration-700 ease-in-out ${
              fadeState ? "opacity-100" : "opacity-0"
            }`}
          >
            Experience{" "}
            <span
              className={`font-bold ${accentColors[currentFeatureIndex]} transition-colors duration-700 ease-in-out`}
            >
              {featureHighlights[currentFeatureIndex]}
            </span>{" "}
            and explore campus like never before.
          </p>
          <button
            onClick={scrollToDepartments}
            className="bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 py-4 px-10 rounded-full text-white font-extrabold shadow-2xl hover:shadow-3xl transition-shadow duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-6 focus:ring-amber-300"
            aria-label="Explore Departments"
          >
            Explore Departments
          </button>
        </section>

        {/* Departments Section */}
        <section
          ref={departmentsRef}
          className="w-full max-w-7xl py-16 px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          aria-label="Departments"
        >
          {departments.map((dept, idx) => (
            <article
              key={dept.name}
              className={`relative group rounded-3xl shadow-lg cursor-pointer flex flex-col items-center bg-gradient-to-br ${
                gradientColors[idx % gradientColors.length]
              } p-6 transition-transform duration-300 hover:scale-105 hover:shadow-xl`}
              onClick={() => handleDepartmentClick(dept.name)}
              aria-label={`Explore ${dept.name} department`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleDepartmentClick(dept.name);
              }}
            >
              <div className="rounded-full bg-white p-5 mb-5 shadow-md group-hover:scale-110 transition-transform duration-300 w-20 h-20 flex items-center justify-center">
                <span className="text-5xl">{dept.icon}</span>
              </div>
              <h3 className="text-white font-extrabold text-2xl mb-3 tracking-wide drop-shadow-md">
                {dept.name}
              </h3>
              <p className="text-white text-center text-base leading-relaxed mb-6 drop-shadow-sm">
                {dept.description}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDepartmentClick(dept.name);
                }}
                className="w-full mt-auto bg-white text-slate-900 font-semibold py-2 rounded-full shadow transition-colors duration-300 hover:bg-slate-200 focus:outline-none"
                aria-label={`Explore ${dept.name} department`}
              >
                Explore {dept.name}
              </button>
            </article>
          ))}
        </section>

        {/* Extra bottom spacing */}
        <div className="my-16"></div>

        <style>{`
          @keyframes blob {
            0%, 100% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -40px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }
          .animate-blob {
            animation: blob 7s infinite ease-in-out;
          }
          @keyframes gradient-x {
            0%, 100% {
              background-position: 0% center;
            }
            50% {
              background-position: 100% center;
            }
          }
          .animate-gradient-x {
            background-size: 200% auto;
            animation: gradient-x 5s ease-in-out infinite;
          }
        `}</style>
      </main>
    </>
  );
};

export default HomePage;
