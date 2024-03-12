"use client"
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr"
import { useContext, createContext } from "react"
import { AuthDocument } from "./graphql/Auth.graphql"
import { useLoginMutation } from "./graphql/Login.graphql"
import { useRouter } from "next/navigation"
import { useLogoutMutation } from "./graphql/Logout.graphql"
import { usePathname } from "next/navigation"
// import { Suspense } from "react"

type AuthProps = {
  user: any
  login: {
    login: (email: string, password: string) => Promise<void>
    data: any
    error: any
    loading: boolean
  }
  logout: {
    logout: () => Promise<void>
    data: any
    error: any
    loading: boolean
  }
  refetchAuth: () => Promise<any>
  authCookie: string
  authParams: any
}

const AuthContext = createContext<Partial<AuthProps>>({ user: null })

export function AuthProvider({ children, authCookie }) {
  // console.log("AuthProvider is invoked")
  // const pathname = usePathname()
  // console.log(pathname)

  const authParams = {
    errrorPolicy: "ignore",
    context: {
      headers: authCookie ? { cookie: "w_auth=" + authCookie } : null,
    },
  }

  const {
    data,
    client,
    refetch: refetchAuth,
  } = useSuspenseQuery<any>(AuthDocument, {
    errorPolicy: "ignore",
    context: {
      headers: authCookie
        ? {
            cookie: "w_auth=" + authCookie,
          }
        : {},
    },
  })

  const user = data && data.auth ? { ...data.auth } : null

  const [
    loginMutation,
    { data: loginData, error: loginError, loading: loginLoading },
  ] = useLoginMutation()
  const [
    logoutMutation,
    { loading: logoutLoading, data: logoutData, error: logoutError },
  ] = useLogoutMutation()
  const router = useRouter()

  const login = async (email: string, password: string) => {
    await loginMutation({
      variables: { input: { email, password } },
    })
    await client.resetStore()

    // router.refresh()
    router.push("/user/dashboard")
  }

  const logout = async () => {
    await logoutMutation()
    await client.resetStore()
    // router.refresh()
    // router.push("/")
  }

  const auth = {
    authCookie,
    user,
    login: { login, data: loginData, error: loginError, loading: loginLoading },
    logout: {
      logout,
      data: logoutData,
      error: logoutError,
      loading: logoutLoading,
    },
    refetchAuth,
    authParams,
  }

  return (
    // <Suspense fallback={"Loading..."}>
    <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
    // </Suspense>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

// function useProviderAuth(authCookie, user /*, cache*/) {
//   const [
//     loginMutation,
//     { data: loginData, error: loginError, loading: loginLoading },
//   ] = useLoginMutation()
//   const [
//     logoutMutation,
//     { loading: logoutLoading, data: logoutData, error: logoutError },
//   ] = useLogoutMutation()
//   const router = useRouter()

//   // console.log("useProviderAuth")
//   const client = useApolloClient()
//   // console.log(client)

//   // const cache = JSON.parse(apolloCache)

//   // client.cache.restore(cache)

//   // console.log(client.cache.extract())
//   // console.log("useProviderAuth is invoked")

//   // setTimeout(() => {}, 5000)

//   // const start = performance.now()
//   // const { client, data } = useQuery<any>(AuthDocument, {
//   //   errorPolicy: "ignore",
//   //   context: {
//   //     headers: authCookie
//   //       ? {
//   //           cookie: "w_auth=" + authCookie,
//   //         }
//   //       : {},
//   //   },
//   // })
//   // console.log(client.cache.extract())
//   // const end = performance.now()

//   // const { client: someClient } = useQuery<any>(TEST_QUERY)

//   // console.log(end - start)
//   // console.log(client.cache.extract())

//   // const { data, client } = useAuthSuspenseQuery({
//   //   errorPolicy: "ignore",
//   //   context: {
//   //     headers: authCookie
//   //       ? {
//   //           cookie: "w_auth=" + authCookie,
//   //         }
//   //       : {},
//   //   },
//   // })

//   // const cache = client.cache.extract()

//   // console.log(cache)

//   // console.log(data)

//   // const user = data && data.auth ? { ...data.auth } : null

//   const login = async (email: string, password: string) => {
//     await loginMutation({
//       variables: { input: { email, password } },
//     })
//     await client.resetStore()

//     // router.refresh()
//     router.push("/user/dashboard")
//   }

//   const logout = async () => {
//     await logoutMutation()
//     await client.resetStore()
//     // router.refresh()
//     router.push("/")
//   }

//   return {
//     user,
//     login: { login, data: loginData, error: loginError, loading: loginLoading },
//     logout: {
//       logout,
//       data: logoutData,
//       error: logoutError,
//       loading: logoutLoading,
//     },
//   }
// }
