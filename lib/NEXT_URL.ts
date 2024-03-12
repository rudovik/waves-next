export const NEXT_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_FRONTEND_URL
    : "https://127.0.0.1:3000"
