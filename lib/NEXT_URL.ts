export const NEXT_URL =
  typeof window === "undefined"
    ? "http://127.0.0.1:" + process.env.PORT || 3000
    : "https://waves-next.vercel.app"
