"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentDashboard = () => {
  const [rollNo, setRollNo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          { withCredentials: true }
        );
        setRollNo(res.data.rollno);
      } catch (err) {
        setError("Could not fetch user info. Please login.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
  <div className="min-h-screen bg-[#0B1220] text-white p-8">

    {/* Background Glow */}
    <div className="fixed top-0 left-0 w-80 h-80 bg-[#4F46E5] blur-[120px] opacity-20 rounded-full"></div>
    <div className="fixed bottom-0 right-0 w-80 h-80 bg-[#06B6D4] blur-[120px] opacity-20 rounded-full"></div>

    {/* Header */}
    <div className="relative z-10 flex justify-between items-center mb-10">
      <div>
        <h1 className="text-4xl font-bold">
          Welcome,
          <span className="text-[#06B6D4]"> #{rollNo}</span>
        </h1>

        <p className="text-gray-400 mt-2">
          Manage your attendance with AI Face Recognition.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-xl">
        <p className="text-sm text-gray-400">Today's Status</p>
        <h3 className="text-[#22C55E] font-bold text-lg">
          Ready
        </h3>
      </div>
    </div>

    {/* Stats */}

    <div className="relative z-10 grid md:grid-cols-3 gap-6">

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#4F46E5] transition">

        <p className="text-gray-400">
          Total Classes
        </p>

        <h2 className="text-4xl font-bold mt-3">
          --
        </h2>

      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#22C55E] transition">

        <p className="text-gray-400">
          Attendance
        </p>

        <h2 className="text-4xl font-bold text-[#22C55E] mt-3">
          --
        </h2>

      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#F59E0B] transition">

        <p className="text-gray-400">
          Pending Classes
        </p>

        <h2 className="text-4xl font-bold text-[#F59E0B] mt-3">
          --
        </h2>

      </div>

    </div>

    {/* Quick Actions */}

    <div className="relative z-10 mt-12">

      <h2 className="text-2xl font-bold mb-6">
        Quick Actions
      </h2>

      <div className="grid lg:grid-cols-3 gap-6">

        <a
          href="/student/classes"
          className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#4F46E5] transition"
        >
          <h3 className="text-xl font-semibold group-hover:text-[#06B6D4]">
            My Classes
          </h3>

          <p className="text-gray-400 mt-2">
            View all enrolled classes and attendance records.
          </p>
        </a>

        <a
          href="/student/search"
          className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#06B6D4] transition"
        >
          <h3 className="text-xl font-semibold group-hover:text-[#06B6D4]">
            Search Classes
          </h3>

          <p className="text-gray-400 mt-2">
            Search and join available classes.
          </p>
        </a>

        <a
          href="/student/profile"
          className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#22C55E] transition"
        >
          <h3 className="text-xl font-semibold group-hover:text-[#22C55E]">
            Profile
          </h3>

          <p className="text-gray-400 mt-2">
            Update your personal information.
          </p>
        </a>

      </div>

    </div>

    {/* Recent Activity */}

    <div className="relative z-10 mt-14">

      <h2 className="text-2xl font-bold mb-5">
        Recent Activity
      </h2>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

        <div className="flex justify-between py-3 border-b border-white/10">
          <span>Face Registered</span>
          <span className="text-[#22C55E]">Completed</span>
        </div>

        <div className="flex justify-between py-3 border-b border-white/10">
          <span>Latest Attendance</span>
          <span className="text-[#06B6D4]">--</span>
        </div>

        <div className="flex justify-between py-3">
          <span>Last Login</span>
          <span className="text-gray-400">Today</span>
        </div>

      </div>

    </div>

  </div>
);
};

export default StudentDashboard;