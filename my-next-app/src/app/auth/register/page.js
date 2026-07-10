"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function RegisterPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [form, setForm] = useState({
    rollno: "",
    password: "",
    role: "STUDENT",
  });

  const [msg, setMsg] = useState("");
  const [photoBlob, setPhotoBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 }
    );
  }, []);

  useEffect(() => {
    async function openCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        setError("Camera permission denied");
      }
    }
    openCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      setPhotoBlob(blob);
      setMsg("Face captured ✔");
    }, "image/jpeg", 0.95);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photoBlob) {
      setError("Capture face first");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append(
        "user",
        new Blob([JSON.stringify(form)], { type: "application/json" })
      );
      formData.append("photo", photoBlob, "face.jpg");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) setMsg("Registered Successfully 🎉");
      else setError(data.message);
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex">

      {/* LEFT SIDE - CAMERA */}
      <div className="w-1/2 relative flex items-center justify-center bg-black">

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent"></div>

        {/* scan line */}
        <div className="absolute w-full h-1 bg-[#06B6D4] animate-pulse top-1/2"></div>

        <button
          onClick={capturePhoto}
          className="absolute bottom-10 bg-[#06B6D4] px-6 py-2 rounded-full font-semibold hover:bg-cyan-500"
        >
          Capture Face
        </button>

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* RIGHT SIDE - FORM */}
      <div ref={containerRef} className="w-1/2 flex items-center justify-center px-12">

        <div className="w-full max-w-md">

          <h1 className="text-4xl font-bold mb-2">
            AI Face Registration
          </h1>

          <p className="text-white/60 mb-8">
            Secure biometric onboarding system
          </p>

          {error && (
            <p className="text-red-400 mb-3">{error}</p>
          )}

          {msg && (
            <p className="text-green-400 mb-3">{msg}</p>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              name="rollno"
              placeholder="Roll Number"
              onChange={handleChange}
              className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-[#06B6D4]"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-[#06B6D4]"
            />

            <select
              name="role"
              onChange={handleChange}
              className="w-full bg-transparent border-b border-white/20 py-3 outline-none"
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-[#4F46E5] hover:bg-[#4338CA] py-3 rounded-full font-semibold"
            >
              {loading ? "Registering..." : "Register"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}