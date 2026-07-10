"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import gsap from "gsap";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const router = useRouter();
  const cardRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  const onSubmit = async (data) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        data,
        { withCredentials: true }
      );

      const userRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        { withCredentials: true }
      );

      const role = userRes.data.role;

      if (role === "TEACHER") router.push("/teacher/dashboard");
      else if (role === "STUDENT") router.push("/student/dashboard");
      else router.push("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1220] px-4">

      {/* Background glow effects */}
      <div className="absolute w-72 h-72 bg-[#4F46E5] blur-3xl opacity-20 rounded-full top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-[#06B6D4] blur-3xl opacity-20 rounded-full bottom-10 right-10"></div>

      <div
        ref={cardRef}
        className="relative w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold text-center">
          Welcome Back
        </h1>
        <p className="text-sm text-center text-white/60 mb-6">
          Login to continue attendance system
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Roll Number */}
          <div>
            <label className="block text-sm mb-1 text-white/70">
              Roll Number
            </label>
            <input
              {...register("rollno", {
                required: "Roll number is required",
              })}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/40 outline-none transition"
              placeholder="Enter your roll number"
            />
            {errors.rollno && (
              <p className="text-red-400 text-xs mt-1">
                {errors.rollno.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1 text-white/70">
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 4,
                  message: "Password too short",
                },
              })}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/40 outline-none transition"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-lg bg-[#4F46E5] hover:bg-[#4338CA] transition font-semibold active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-white/60">
          Forgot password?{" "}
          <a href="/reset" className="text-[#06B6D4] hover:underline">
            Reset here
          </a>
        </div>
      </div>
    </div>
  );
}