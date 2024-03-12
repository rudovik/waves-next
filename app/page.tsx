"use client"
import { HomeSlider } from "components/HomeSlider"
import { HomePromotion } from "components/HomePromotion"
import { useGetSortedProductsSuspenseQuery } from "lib/graphql/GetSortedProducts.graphql"
import { SortBy } from "__generated__/__types__"
import { CardBlock } from "components/CardBlock"
import { Suspense } from "react"
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr"
import { GetSortedProductsDocument } from "lib/graphql/GetSortedProducts.graphql"
import { useApolloClient } from "@apollo/client"

export default function Page() {
  // const ac = useApolloClient()

  const {
    data: bySoldData,
    // loading: bySoldLoading,
    error: bySoldError,
    client,
  } = useGetSortedProductsSuspenseQuery({
    variables: {
      sortBy: SortBy.Sold,
      limit: 4,
      order: "desc",
    },
  })
  // console.log(client)
  // console.log(client === ac)

  // const {
  //   data: bySoldData,
  //   // loading: bySoldLoading,
  //   error: bySoldError,
  // } = useSuspenseQuery(GetSortedProductsDocument, {
  //   variables: {
  //     sortBy: SortBy.Sold,
  //     limit: 4,
  //     order: "desc",
  //   },
  // })

  const {
    data: byArrivalData,
    // loading: byArrivalLoading,
    error: byArrivalError,
    // client,
  } = useGetSortedProductsSuspenseQuery({
    variables: {
      sortBy: SortBy.CreatedAt,
      limit: 4,
      order: "desc",
    },
  })
  // console.log(byArrivalData)
  // console.log(bySoldData)
  // const loading = byArrivalLoading && bySoldLoading
  // if (byArrivalData && bySoldData) {
  //   const cache = client.cache.extract()
  //   console.log(cache)
  // }
  // console.log(bySoldData)
  // console.log(byArrivalData)
  return (
    <div>
      <HomeSlider />
      {/* <Suspense fallback="...Loading"> */}
      <CardBlock
        list={bySoldData.getSortedProducts}
        title="Best Selling Guitars"
      />
      {/* </Suspense> */}

      <HomePromotion />
      {/* <Suspense fallback="...Loading"> */}
      <CardBlock list={byArrivalData.getSortedProducts} title="New Arrivals" />
      {/* </Suspense> */}
    </div>
  )
}
