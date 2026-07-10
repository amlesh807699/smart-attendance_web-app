"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const ClassAttendancePage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError("");

    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/teacher/attendance/class/${id}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setStudents(res.data || []);
      })
      .catch(() => {
        setError("Unable to fetch attendance. Try again.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-[#0B1220] text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-[450px] h-[450px] rounded-full bg-[#4F46E5] blur-[150px] opacity-20"></div>
      <div className="absolute -bottom-40 -right-40 w-[450px] h-[450px] rounded-full bg-[#06B6D4] blur-[150px] opacity-20"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-5xl font-bold">
              Class <span className="text-[#06B6D4]">Attendance</span>
            </h1>

            <p className="mt-3 text-gray-400">
              Students verified using AI Face Recognition.
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] px-6 py-3 font-semibold transition"
          >
            ← Back
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-10">
            <div className="animate-pulse space-y-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 rounded-xl bg-white/10"
                />
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-[#EF4444]/30 bg-[#EF4444]/10 p-6 text-center text-red-300">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && students.length === 0 && (
          <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl py-24 text-center">
            <h2 className="text-3xl font-bold">
              No Students Joined Yet
            </h2>

            <p className="mt-4 text-gray-400">
              No attendance records found for this class.
            </p>

            <button
              onClick={() => router.back()}
              className="mt-8 bg-[#4F46E5] hover:bg-[#4338CA] px-8 py-3 rounded-xl font-semibold transition"
            >
              Go Back
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && students.length > 0 && (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            {/* Table Header */}
            <div className="flex justify-between items-center px-8 py-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold">
                  Present Students
                </h2>

                <p className="text-gray-400 mt-1">
                  Total Present: {students.length}
                </p>
              </div>
            </div>

            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-300">#</th>
                  <th className="px-6 py-4 text-left text-gray-300">
                    Roll Number
                  </th>
                  <th className="px-6 py-4 text-left text-gray-300">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.map((student, index) => (
                  <tr
                    key={student.id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="px-6 py-5 font-semibold">
                      {index + 1}
                    </td>

                    <td className="px-6 py-5 font-medium">
                      {student.rollno}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full border border-[#22C55E]/30 bg-[#22C55E]/20 px-4 py-1 text-sm font-semibold text-[#22C55E]">
                        Present
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassAttendancePage;