import { cookies, headers } from "next/headers"

export const getHostAndCookie = () => {
  const headerList = headers()
  const cookieRef = cookies()

  let cookieValue = ""
  const allCookies = cookieRef.getAll()
  allCookies.forEach((cookie) => {
    cookieValue += cookie.name + "=" + cookie.value + ";"
  })
  const host = headerList.get("Host")

  return { cookie: cookieValue, host }
}
