import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Glow background effects */}
      <div className="absolute w-72 h-72 bg-[#4F46E5] blur-3xl opacity-20 rounded-full top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-[#06B6D4] blur-3xl opacity-20 rounded-full bottom-10 right-10"></div>

      {/* Header */}
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
        Smart Attendance System
      </h1>

      <p className="text-white/60 text-center max-w-xl mb-10">
        A secure and intelligent attendance system where teachers can create
        classes and track attendance. Students can join classes only after
        successful face verification.
      </p>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl z-10">

        {/* Teacher Card */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 hover:border-[#4F46E5] transition shadow-lg">

          <h2 className="text-2xl font-semibold mb-3">
            Teacher Panel
          </h2>

          <p className="text-white/60 mb-4">
            Create and manage classes, and monitor student attendance in real-time.
          </p>

          <button className="bg-[#4F46E5] hover:bg-[#4338CA] transition text-white px-5 py-2 rounded-lg">
            Create Class
          </button>
        </div>

        {/* Student Card */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 hover:border-[#06B6D4] transition shadow-lg">

          <h2 className="text-2xl font-semibold mb-3">
            Student Panel
          </h2>

          <p className="text-white/60 mb-4">
            Join your class securely with face verification and mark your attendance instantly.
          </p>

          <button className="bg-[#22C55E] hover:bg-green-600 transition text-white px-5 py-2 rounded-lg">
            Join Class
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="mt-16 max-w-4xl text-center z-10">

        <h3 className="text-2xl font-bold mb-6">
          Key Features
        </h3>

        <ul className="grid md:grid-cols-3 gap-6 text-white/70">

          <li className="bg-white/5 border border-white/10 p-4 rounded-xl hover:border-[#06B6D4] transition">
            Face Recognition Authentication
          </li>

          <li className="bg-white/5 border border-white/10 p-4 rounded-xl hover:border-[#4F46E5] transition">
            Real-time Attendance Tracking
          </li>

          <li className="bg-white/5 border border-white/10 p-4 rounded-xl hover:border-[#22C55E] transition">
            Secure & Tamper-Proof System
          </li>

        </ul>
      </div>

    </div>
  );
};

export default HomePage;