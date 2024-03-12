import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { gql } from "@apollo/client"
import { GraphQLClient } from "graphql-request"

const host = process.env.HOST

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  return null
  const query = gql(`query Auth {
    auth {
      isAdmin
      isAuth
    }
  }`)

  let user
  const cookie = request.headers.get("cookie")
  if (!cookie) {
    user = { isAuth: false }
  } else {
    const client = new GraphQLClient("http://localhost:3000/api/graphql", {
      headers: { cookie },
      fetch,
    })

    // const start = Date.now()
    try {
      user = (await client.request(query)) as any
      user = user.auth
    } catch (error) {
      user = { isAuth: false }
    }
    // const end = Date.now()
    // console.log(end - start)
  }

  const requestUrl = request.url.split(host)[1]
  const redirectTo = links[requestUrl].redirect
  if (
    user.isAuth === links[requestUrl].isAuth &&
    ("isAdmin" in links[requestUrl]
      ? user.isAdmin === links[requestUrl].isAdmin
      : true)
  ) {
    return null
  } else {
    const redirectUrl = new URL(redirectTo, request.url)
    return NextResponse.redirect(redirectUrl)
  }
}

const links = {
  ["/register_login"]: { redirect: "/user/dashboard", isAuth: false },
  ["/register"]: { redirect: "/user/dashboard", isAuth: false },
  ["/user/dashboard"]: { redirect: "/register_login", isAuth: true },
  ["/admin"]: { redirect: "/user/dashboard", isAuth: true, isAdmin: true },
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/user/dashboard", "/register_login", "/register", "/admin"],
}
