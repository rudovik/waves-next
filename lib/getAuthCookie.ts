import { cookies } from "next/headers"

export const getAuthCookie = () => {
  let authCookie = null
  const cookieStore = cookies()
  const cookie = cookieStore.get("w_auth")
  authCookie = cookie && cookie.value

  return authCookie
}
