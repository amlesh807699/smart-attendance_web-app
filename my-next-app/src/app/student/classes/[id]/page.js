"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { gsap } from "gsap";

export default function SingleClass() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);

  const cardRef = useRef(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/student/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    if (data && cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 40,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
        }
      );
    }
  }, [data]);

  if (!data)
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0B1220] text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#4F46E5] blur-[140px] opacity-20 rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#06B6D4] blur-[140px] opacity-20 rounded-full"></div>

      <div className="max-w-5xl mx-auto px-6 py-20 relative z-10">

        <button
          onClick={() => router.back()}
          className="mb-8 text-[#06B6D4] hover:text-white transition"
        >
          ← Back
        </button>

        <div
          ref={cardRef}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
        >

          {/* Header */}
          <div className="h-2 bg-gradient-to-r from-[#4F46E5] to-[#06B6D4]" />

          <div className="p-10">

            <h1 className="text-4xl font-bold mb-6">
              {data.name}
            </h1>

            <p className="text-gray-400 leading-8 text-lg">
              {data.description}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <button
                onClick={() =>
                  router.push(`/student/classes/${id}/verify`)
                }
                className="bg-[#4F46E5] hover:bg-[#4338CA] px-8 py-3 rounded-xl font-semibold transition duration-300 hover:shadow-lg hover:shadow-[#4F46E5]/40"
              >
                Join Class
              </button>

              <button
                onClick={() => router.back()}
                className="border border-white/20 hover:border-[#06B6D4] px-8 py-3 rounded-xl transition"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}