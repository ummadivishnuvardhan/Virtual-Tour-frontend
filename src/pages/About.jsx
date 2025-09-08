import React from "react";
import { Fade } from "react-awesome-reveal";
import { FaChalkboardTeacher, FaFlask, FaVrCardboard, FaUsers, FaPlusCircle, FaGlobe } from "react-icons/fa";


// The list of animated hero words


// ✅ Define use cases
const useCases = [
  {
    title: "Virtual Classrooms",
    desc: "Explore lecture halls and classrooms in an interactive 360° VR experience.",
    icon: <FaChalkboardTeacher className="text-indigo-600" />,
  },
  {
    title: "Labs & Research",
    desc: "Step inside cutting-edge labs to understand research facilities and projects.",
    icon: <FaFlask className="text-indigo-600" />,
  },
  {
    title: "VR Immersion",
    desc: "Engage with a fully immersive view of the entire CSE department environment.",
    icon: <FaVrCardboard className="text-indigo-600" />,
  },
  {
    title: "Events & Activities",
    desc: "Relive department events, workshops, and hackathons virtually.",
    icon: <FaUsers className="text-indigo-600" />,
  },
  {
    title: "Add New Rooms",
    desc: "Admins can easily add and manage new rooms dynamically.",
    icon: <FaPlusCircle className="text-indigo-600" />,
  },
  {
    title: "Global Access",
    desc: "Open access for students, parents, and faculty across the world.",
    icon: <FaGlobe className="text-indigo-600" />,
  },
];

export default function About() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-white overflow-hidden flex flex-col items-center py-16 px-4 sm:px-8">
      {/* Background Shapes */}
      <div className="absolute w-[500px] h-[500px] bg-indigo-300 opacity-20 blur-3xl rounded-full left-[-200px] top-[-150px] pointer-events-none" />
      <div className="absolute w-[700px] h-[400px] bg-indigo-400 opacity-10 blur-3xl rounded-full right-[-350px] bottom-[-100px] pointer-events-none" />

      {/* Hero */}
      <section className="relative z-10 text-center max-w-3xl mx-auto mb-14 pt-8">
       


        {/* Reveal remaining description */}
        <Fade
          direction="up"
         
          triggerOnce
        >
          <p className="text-lg md:text-xl text-slate-600 font-medium">
            Experience every part of our Computer Science department virtually—classrooms, labs, events, and more—all in stunning 360&deg; VR.
          </p>
        </Fade>
      </section>

      {/* Use Cases */}
      <section className="relative z-10 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 mb-16">
        {useCases.map((uc) => (
          <div
            key={uc.title}
            className="bg-white/90 rounded-xl text-center px-6 py-8 shadow-lg border border-indigo-100 hover:shadow-2xl transition group"
          >
            <div className="text-3xl mb-3 group-hover:scale-110 transition">{uc.icon}</div>
            <h3 className="font-bold text-indigo-700 text-lg mb-2">{uc.title}</h3>
            <p className="text-gray-600 text-sm">{uc.desc}</p>
          </div>
        ))}
      </section>

      {/* Quotation */}
      <figure className="relative z-10 max-w-2xl text-center mt-2 mb-12">
        <blockquote className="text-xl text-indigo-700 italic font-medium mb-2 animate-fadeIn">
          “Bringing the CSE Department to life through immersive VR.”
        </blockquote>
        
      </figure>
    </div>
  );
}
