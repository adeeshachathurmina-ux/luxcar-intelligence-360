// Centralized API configuration supporting local development and cloud production deployment
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://adeeshachathurmina-ds-luxcar-backend.hf.space"
    : "http://127.0.0.1:8000")
).replace(/\/$/, "");
