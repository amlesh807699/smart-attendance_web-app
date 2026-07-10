"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [userRole, setUserRole] = useState(null);

  const fetchRole = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        {
          withCredentials: true,
        }
      );

      setUserRole(res.data.role);
    } catch {
      setUserRole(null);
    }
  };

  useEffect(() => {
    fetchRole();

    const handleRoleChange = () => {
      fetchRole();
    };

    window.addEventListener("roleChange", handleRoleChange);

    return () => {
      window.removeEventListener("roleChange", handleRoleChange);
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.log(err);
    }

    setUserRole(null);

    window.dispatchEvent(new Event("roleChange"));

    router.push("/auth/login");
  };

  const linkClass = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
      pathname === path || pathname.startsWith(path)
        ? "bg-[#4F46E5] text-white shadow-md"
        : "text-white/70 hover:text-white hover:bg-white/10"
    }`;

  return (
    <nav className="bg-[#0B1220] border-b border-white/10 px-6 py-3 flex justify-between items-center">
      <Link
        href="/"
        className="text-xl font-bold text-white hover:text-[#06B6D4]"
      >
        Smart Attendance
      </Link>

      <div className="flex items-center gap-3">
        <Link href="/" className={linkClass("/")}>
          Home
        </Link>

        {userRole === "STUDENT" && (
          <>
            <Link
              href="/student/dashboard"
              className={linkClass("/student/dashboard")}
            >
              Dashboard
            </Link>

            <Link
              href="/student/classes"
              className={linkClass("/student/classes")}
            >
              Classes
            </Link>

            <Link
              href="/student/search"
              className={linkClass("/student/search")}
            >
              Search
            </Link>
          </>
        )}

        {userRole === "TEACHER" && (
          <>
            <Link
              href="/teacher/dashboard"
              className={linkClass("/teacher/dashboard")}
            >
              Dashboard
            </Link>

            <Link
              href="/teacher/class"
              className={linkClass("/teacher/class")}
            >
              Classes
            </Link>
          </>
        )}

        {!userRole ? (
          <>
            <Link
              href="/auth/login"
              className={linkClass("/auth/login")}
            >
              Login
            </Link>

            <Link
              href="/auth/register"
              className={linkClass("/auth/register")}
            >
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md bg-[#EF4444] hover:bg-red-600 text-white transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}