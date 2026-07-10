"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const TeacherClassesPage = () => {
  const router = useRouter();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [status, setStatus] = useState("ONGOING");
  const [creating, setCreating] = useState(false);

  
  const fetchClasses = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/teacher/all/class`,
        { withCredentials: true }
      );
      setClasses(res.data);
    } catch (err) {
      console.error("Fetch classes failed:", err);
      setError(" Unable to fetch classes. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);


  const handleCreateClass = async () => {
    if (!name.trim()) {
      alert("Class name is required");
      return;
    }

    setCreating(true);
    setError("");

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/teacher/create/class`,
        { name, meetingUrl, status },
        { withCredentials: true }
      );

      setName("");
      setMeetingUrl("");
      setStatus("ONGOING");

      await fetchClasses(); 
    } catch (err) {
      console.error("Create class failed:", err);
      setError(" Failed to create class");
    } finally {
      setCreating(false);
    }
  };

  
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this class?")) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/teacher/${id}`,
        { withCredentials: true }
      );
      setClasses(classes.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete class failed:", err);
      setError("Failed to delete class");
    }
  };

  if (loading) return <div className="text-center mt-20">Loading classes...</div>;

  return (
  <div className="min-h-screen bg-[#0B1220] text-white relative overflow-hidden">

    {/* Background Glow */}
    <div className="absolute -top-40 -left-40 w-[450px] h-[450px] bg-[#4F46E5] rounded-full blur-[150px] opacity-20" />
    <div className="absolute -bottom-40 -right-40 w-[450px] h-[450px] bg-[#06B6D4] rounded-full blur-[150px] opacity-20" />

    <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-bold">
          Teacher <span className="text-[#06B6D4]">Classes</span>
        </h1>

        <p className="text-gray-400 mt-3">
          Create and manage your AI Attendance classes.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 p-4 text-red-300">
          {error}
        </div>
      )}

      {/* Create Class */}
      <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">

        <h2 className="text-2xl font-bold mb-6">
          Create New Class
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <input
            placeholder="Class Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-[#06B6D4]"
          />

          <input
            placeholder="Meeting URL"
            value={meetingUrl}
            onChange={(e) => setMeetingUrl(e.target.value)}
            className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:border-[#06B6D4]"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl bg-[#162032] border border-white/10 px-4 py-3 outline-none focus:border-[#06B6D4]"
          >
            <option value="ONGOING">ONGOING</option>
            <option value="FINISHED">FINISHED</option>
          </select>

          <button
            onClick={handleCreateClass}
            disabled={creating}
            className="rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] transition py-3 font-semibold disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create Class"}
          </button>

        </div>

      </div>

      {/* Loading */}
      {loading && (
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-3xl bg-white/5 animate-pulse border border-white/10"
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && classes.length === 0 && (
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold">
            No Classes Found
          </h2>

          <p className="text-gray-500 mt-3">
            Create your first class above.
          </p>
        </div>
      )}

      {/* Classes */}
      {!loading && classes.length > 0 && (

        <div className="grid lg:grid-cols-2 gap-8">

          {classes.map((cls) => (

            <div
              key={cls.id}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 hover:border-[#06B6D4] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]"
            >

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4F46E5] to-[#06B6D4]" />

              <div className="flex justify-between items-center">

                <div>

                  <h2 className="text-2xl font-bold group-hover:text-[#06B6D4] transition">
                    {cls.name}
                  </h2>

                  <p className="mt-3 text-gray-400">
                    Status :
                    <span
                      className={`ml-2 font-semibold ${
                        cls.status === "ONGOING"
                          ? "text-[#22C55E]"
                          : "text-[#F59E0B]"
                      }`}
                    >
                      {cls.status}
                    </span>
                  </p>

                </div>

              </div>

              <div className="flex gap-4 mt-8">

                <button
                  onClick={() => router.push(`/teacher/class/${cls.id}`)}
                  className="flex-1 rounded-xl bg-[#22C55E] py-3 font-semibold hover:bg-green-600 transition"
                >
                  Attendance
                </button>

                <button
                  onClick={() => handleDelete(cls.id)}
                  className="flex-1 rounded-xl bg-[#EF4444] py-3 font-semibold hover:bg-red-600 transition"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  </div>
);
};

export default TeacherClassesPage;