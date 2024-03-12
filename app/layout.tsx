import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter"
import "./global.css"
import { ApolloWrapper } from "lib/apolloWrapper"
import { AuthProvider } from "lib/useAuth"

import { Header } from "components/Header"
import { Footer } from "components/Footer"

import { getAuthCookie } from "lib/getAuthCookie"

import { oswald } from "./fonts"
import { BackdropComponent } from "components/Backdrop"
import { Suspense } from "react"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authCookie = getAuthCookie()

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={oswald.className}>
        {/* <BackdropComponent /> */}
        <AppRouterCacheProvider>
          {/* <div> */}
          {/* <Suspense fallback={<BackdropComponent />}> */}
          <ApolloWrapper>
            <AuthProvider authCookie={authCookie}>
              <Header />
              <div className="page_container">{children}</div>
              <Footer />
            </AuthProvider>
          </ApolloWrapper>
          {/* </Suspense> */}
          {/* </div> */}
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
