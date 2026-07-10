"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { gsap } from "gsap";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TeacherDashboard = () => {
  const router = useRouter();
  const containerRef = useRef(null);

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          {
            withCredentials: true,
          }
        );

        if (res.data.role !== "TEACHER") {
          router.push("/auth/login");
          return;
        }

        setTeacher({
          rollno: res.data.rollno,
          role: res.data.role,
          photoUrl: res.data.photoUrl,
        });
      } catch (err) {
        console.error(err);
        setError("Unable to load teacher profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [router]);

  useEffect(() => {
    if (!loading && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        }
      );
    }
  }, [loading]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      router.push("/auth/login");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center text-white text-xl">
        Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center text-red-400 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1220] relative overflow-hidden text-white">
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-[450px] h-[450px] rounded-full bg-[#4F46E5] blur-[160px] opacity-20"></div>

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#06B6D4] blur-[160px] opacity-20"></div>

      <div
        ref={containerRef}
        className="relative z-10 max-w-7xl mx-auto px-6 py-12"
      >
        {/* Header */}

        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex items-center gap-6">
            <img
              src={teacher.photoUrl}
              alt="Teacher"
              className="w-28 h-28 rounded-full border-4 border-[#06B6D4] object-cover shadow-2xl"
            />

            <div>
              <h1 className="text-4xl font-bold">
                Welcome,
                <span className="text-[#06B6D4]"> {teacher.rollno}</span>
              </h1>

              <p className="text-gray-400 mt-2">
                AI Face Recognition Attendance System
              </p>

              <span className="inline-block mt-4 px-4 py-1 rounded-full bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30">
                {teacher.role}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-6 py-3 rounded-xl bg-[#EF4444] hover:bg-red-600 transition font-semibold"
          >
            Logout
          </button>
        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8">
            <p className="text-gray-400">Role</p>
            <h2 className="text-3xl font-bold mt-2">{teacher.role}</h2>
          </div>

          <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8">
            <p className="text-gray-400">Teacher ID</p>
            <h2 className="text-3xl font-bold mt-2">{teacher.rollno}</h2>
          </div>

          <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8">
            <p className="text-gray-400">System</p>
            <h2 className="text-3xl font-bold mt-2 text-[#22C55E]">Active</h2>
          </div>
        </div>

        {/* Quick Actions */}

        <div className="grid md:grid-cols-2 gap-8">
          <Link href="/teacher/class">
            <div className="cursor-pointer rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 hover:border-[#4F46E5] hover:-translate-y-2 transition duration-300">
              <div className="text-5xl mb-5">📚</div>

              <h2 className="text-2xl font-bold mb-3">
                Manage Classes
              </h2>

              <p className="text-gray-400">
                Create, update and manage your classroom sessions.
              </p>
            </div>
          </Link>

          <Link href="/teacher/class">
            <div className="cursor-pointer rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 hover:border-[#06B6D4] hover:-translate-y-2 transition duration-300">
              <div className="text-5xl mb-5">📊</div>

              <h2 className="text-2xl font-bold mb-3">
                Attendance
              </h2>

              <p className="text-gray-400">
                View AI verified attendance records instantly.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;