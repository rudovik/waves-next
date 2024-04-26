"use client"
// ^ this file needs the "use client" pragma

import { ApolloLink, HttpLink } from "@apollo/client"
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr"
import { NEXT_URL } from "./NEXT_URL"

// have a function to create a client for you

const makeClient = ({ host, cookie }) => {
  let httpLink: HttpLink
  const serverEnv = typeof window === "undefined"
  const devMode = process.env.NODE_ENV === "development"
  if (serverEnv) {
    let prefix = process.env.NODE_ENV === "production" ? "https://" : "http://"
    if (host.startsWith("localhost:")) {
      prefix = "http://"
    }
    httpLink = new HttpLink({
      uri: prefix + host + "/api/graphql",
      headers: { Cookie: cookie },
    })
  } else {
    httpLink = new HttpLink({
      uri: "/api/graphql",
    })
  }

  // console.log("Hello There!")

  // const existingCache = JSON.parse(cache)
  // // console.log(existingCache)
  // const cacheToCreate = new NextSSRInMemoryCache()
  // cacheToCreate.restore(existingCache)
  // console.log(cacheToCreate.extract())

  return new NextSSRApolloClient({
    connectToDevTools: process.env.NODE_ENV === "development" ? true : false,
    // use the `NextSSRInMemoryCache`, not the normal `InMemoryCache`
    cache: new NextSSRInMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            getProductsToShop: {
              keyArgs: ["filters"],
              merge(existing, incoming) {
                return existing
                  ? {
                      ...existing,
                      products: [...existing.products, ...incoming.products],
                      size: incoming.size,
                    }
                  : incoming
              },
            },
          },
        },
      },
    }),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            // in a SSR environment, if you use multipart features like
            // @defer, you need to decide how to handle these.
            // This strips all interfaces with a `@defer` directive from your queries.
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
  })
}

// you need to create a component to wrap your app in
export function ApolloWrapper({
  children,
  host,
  cookie,
}: {
  children: React.ReactNode
  host: string
  cookie: string
}) {
  return (
    <ApolloNextAppProvider makeClient={() => makeClient({ host, cookie })}>
      {children}
    </ApolloNextAppProvider>
  )
}
