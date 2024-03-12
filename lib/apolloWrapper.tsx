"use client"
// ^ this file needs the "use client" pragma
import { AuthDocument } from "./graphql/Auth.graphql"
import { Product } from "models/Product"

import { ApolloLink, HttpLink } from "@apollo/client"
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr"

// have a function to create a client for you
const makeClient = () => {
  const httpLink = new HttpLink({
    // this needs to be an absolute url, as relative urls cannot be used in SSR
    uri: "http://localhost:3000/api/graphql",
    // you can disable result caching here if you want to
    // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
    fetchOptions: { cache: "no-store" },
    // you can override the default `fetchOptions` on a per query basis
    // via the `context` property on the options passed as a second argument
    // to an Apollo Client data fetching hook, e.g.:
    // const { data } = useSuspenseQuery(MY_QUERY, { context: { fetchOptions: { cache: "force-cache" }}});
  })

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
export function ApolloWrapper({ children }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  )
}
