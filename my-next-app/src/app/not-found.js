import Link from "next/link";

export default function Custom404() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for does not exist.</p>

      <Link
        href="/"
        style={{ color: "blue", textDecoration: "underline" }}
      >
        Go back home
      </Link>
    </div>
  );
}