"use client";

import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

const ClassSearchPage = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const cardsRef = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const getClasses = async () => {
        try {
          setLoading(true);
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/student/all/class?name=${query}`,
            { withCredentials: true }
          );
          setResult(res.data);
        } catch (err) {
          console.error("Error fetching classes:", err);
        } finally {
          setLoading(false);
        }
      };

      if (query.trim()) {
        getClasses();
      } else {
        setResult([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // ✅ Fix GSAP ref reset
  useEffect(() => {
    cardsRef.current = [];

    if (result.length > 0) {
      gsap.from(cardsRef.current, {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.6,
        ease: "power3.out",
      });
    }
  }, [result]);

  return (
  <div className="min-h-screen bg-[#0B1220] text-white relative overflow-hidden">

    {/* Background Glow */}
    <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#4F46E5] rounded-full blur-[150px] opacity-20"></div>
    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#06B6D4] rounded-full blur-[150px] opacity-20"></div>

    <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold">
          Search
          <span className="text-[#06B6D4]"> Classes</span>
        </h1>

        <p className="text-gray-400 mt-3">
          Find classes instantly using AI powered search.
        </p>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-12">
        <input
          type="text"
          placeholder="Search by class name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl px-6 py-4 text-white placeholder:text-gray-500 outline-none focus:border-[#06B6D4] transition"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-56 rounded-3xl bg-white/5 border border-white/10 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && query && result.length === 0 && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-300">
            No Classes Found
          </h2>

          <p className="text-gray-500 mt-2">
            Try another keyword.
          </p>
        </div>
      )}

      {/* Cards */}
      {!loading && result.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {result.map((cls, index) => (
            <div
              key={cls.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#06B6D4] hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]"
            >

              {/* Top Accent */}
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#4F46E5] to-[#06B6D4]" />

              <h2 className="mt-2 text-2xl font-bold group-hover:text-[#06B6D4] transition">
                {cls.name}
              </h2>

              <p className="mt-4 text-gray-400 leading-7 line-clamp-3">
                {cls.description}
              </p>

              <button
                className="mt-8 w-full rounded-xl bg-[#4F46E5] py-3 font-semibold transition hover:bg-[#4338CA] hover:shadow-lg hover:shadow-[#4F46E5]/40 active:scale-95"
              >
                View Class
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  </div>
);
};

export default ClassSearchPage;