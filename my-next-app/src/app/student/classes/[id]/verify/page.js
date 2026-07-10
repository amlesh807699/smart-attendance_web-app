"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

export default function FaceVerification() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const { id } = useParams();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
      } catch (err) {
        setError("Camera access denied");
        console.error(err);
      }
    };

    startCamera();

    return () => stopCamera();
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  
  const capturePhoto = async () => {
    setLoading(true);
    setError("");

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      try {
        const formData = new FormData();
        formData.append("photo", blob, "photo.png");
        formData.append("classId", id);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/student/verify-face`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        const data = await res.json();
        setResult(data);
        setLoading(false);

        if (data.success) {
          stopCamera();
          alert("Face Verified! Opening Zoom...");
          window.location.href = data.meetingUrl;
        }
      } catch (err) {
        setLoading(false);
        setError("Verification failed. Please try again.");
      }
    }, "image/png");
  };

  return (
    <div className="p-6 flex flex-col items-center bg-gray-50 min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Face Verification</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg shadow-md mb-4 border-2 border-gray-200"
        />

        <canvas ref={canvasRef} className="hidden" />

        <button
          onClick={capturePhoto}
          disabled={loading}
          className={`w-full px-6 py-3 mt-4 rounded-lg text-white font-semibold transition-all ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Verifying..." : "Capture & Verify"}
        </button>

        {result && !result.success && (
          <div className="mt-6 p-4 border rounded-lg bg-red-50 w-full text-center">
            <p className="text-red-600 font-semibold">{result.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}