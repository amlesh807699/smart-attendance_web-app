"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const cardsRef = useRef([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/student/all/class`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setClasses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (classes.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.7,
          ease: "power3.out",
        }
      );
    }
  }, [classes]);

  const go = (id) => {
    router.push(`../student/classes/${id}`);
  };

  return (
  <div className="min-h-screen bg-[#0B1220] text-white relative overflow-hidden">
    {/* Background Glow */}
    <div className="absolute -top-40 -left-40 w-[450px] h-[450px] bg-[#4F46E5] rounded-full blur-[150px] opacity-20" />
    <div className="absolute -bottom-40 -right-40 w-[450px] h-[450px] bg-[#06B6D4] rounded-full blur-[150px] opacity-20" />

    <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-14">
        <h1 className="text-5xl font-bold">
          Explore <span className="text-[#06B6D4]">Classes</span>
        </h1>

        <p className="mt-4 text-gray-400 text-lg">
          Browse all available classes and join with AI Face Attendance.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-60 rounded-3xl bg-white/5 border border-white/10 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && classes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24">
          <h2 className="text-3xl font-bold text-gray-300">
            No Classes Available
          </h2>

          <p className="mt-3 text-gray-500">
            There are currently no classes available.
          </p>
        </div>
      )}

      {/* Cards */}
      {!loading && classes.length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {classes.map((cls, index) => (
            <div
              key={cls.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#06B6D4] hover:shadow-[0_0_40px_rgba(6,182,212,0.18)]"
            >
              {/* Accent */}
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#4F46E5] to-[#06B6D4]" />

              {/* Badge */}
              <div className="inline-flex rounded-full bg-[#4F46E5]/20 border border-[#4F46E5]/30 px-3 py-1 text-xs text-[#A5B4FC]">
                AI Attendance
              </div>

              <h2 className="mt-5 text-2xl font-bold group-hover:text-[#06B6D4] transition">
                {cls.name}
              </h2>

              <p className="mt-4 text-gray-400 leading-7 line-clamp-3">
                {cls.description}
              </p>

              <button
                onClick={() => go(cls.id)}
                className="mt-8 w-full rounded-xl bg-[#4F46E5] py-3 font-semibold transition-all duration-300 hover:bg-[#4338CA] hover:shadow-lg hover:shadow-[#4F46E5]/40 active:scale-95"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}