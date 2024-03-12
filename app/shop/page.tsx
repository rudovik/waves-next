"use client"

import { PageTop } from "components/PageTop"
import { useGetAllWoodsSuspenseQuery } from "lib/graphql/GetAllWoods.graphql"
import { useGetAllBrandsSuspenseQuery } from "lib/graphql/GetAllBrands.graphql"
import { CheckboxCollapse } from "components/CheckboxCollapse"
import { RadioCollapse } from "components/RadioCollapse"
import { frets } from "lib/fixedCategories"
import { price } from "lib/fixedCategories"
import { useState } from "react"
import {
  useGetProductsToShopQuery,
  useGetProductsToShopSuspenseQuery,
} from "lib/graphql/GetProductsToShop.graphql"
import { BackdropComponent } from "components/Backdrop"
import { useTransition } from "react"
import { LoadMoreCards } from "components/LoadMoreCards"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { faTh } from "@fortawesome/free-solid-svg-icons"

export default function ShopPage() {
  const [state, setState] = useState({
    grid: "",
    limit: 6,
    skip: 0,
    filters: {
      brand: [],
      frets: [],
      wood: [],
      price: [],
    },
  })
  const [isPending, startTransition] = useTransition()

  const {
    data: { getAllWoods: woods },
    error: woodsError,
  } = useGetAllWoodsSuspenseQuery()
  const {
    data: { getAllBrands: brands },
    error: brandsError,
  } = useGetAllBrandsSuspenseQuery()
  const {
    data: {
      getProductsToShop: { products },
    },
    error,
  } = useGetProductsToShopSuspenseQuery({
    variables: {
      limit: state.limit,
      skip: state.skip,
      filters: { ...state.filters },
    },
  })
  // console.log(state.skip)
  const {
    loading: loadingMore,
    data: {
      getProductsToShop: { products: moreProducts, size },
    },
    fetchMore,
  } = useGetProductsToShopQuery({
    variables: { limit: state.limit, skip: state.skip, filters: state.filters },
  })

  function handlePrice(value) {
    const data = price
    let array = []
    for (let key in data) {
      if (data[key]._id === value) {
        // console.log(data[key]._id)
        // console.log(value)
        array = [...data[key].array]
        break
      }
    }
    return [...array]
  }

  function filterProducts(filters, category) {
    const newFilters = { ...state.filters }

    // console.log(filters)
    if (category === "price") {
      // newFilters[category] = [filters]
      let priceValues = handlePrice(filters)
      newFilters[category] = [...priceValues]
    } else {
      newFilters[category] = [...filters]
    }
    startTransition(() => {
      setState((oldState) => {
        return { ...oldState, filters: { ...newFilters }, skip: 0 }
      })
    })
  }

  async function loadMoreCards() {
    let skip = state.skip + state.limit
    // console.log({ ...state, skip })
    startTransition(async () => {
      await fetchMore({
        variables: { skip },
      })
      setState((oldState) => {
        return { ...oldState, skip }
      })
    })
  }

  // console.log(state.skip)

  function handleGrid() {
    setState({ ...state, grid: !state.grid ? "grid_bars" : "" })
  }

  return (
    <div>
      {(isPending || loadingMore) && <BackdropComponent />}
      <PageTop title="Browse Products" />
      <div className="container">
        <div className="shop_wrapper">
          <div className="left">
            <CheckboxCollapse
              initState={true}
              title="Brands"
              list={brands}
              filterHandler={(filters) => filterProducts(filters, "brand")}
            />
            <CheckboxCollapse
              initState={false}
              title="Frets"
              list={frets}
              filterHandler={(filters) => filterProducts(filters, "frets")}
            />
            <CheckboxCollapse
              initState={false}
              title="Wood"
              list={woods}
              filterHandler={(filters) => filterProducts(filters, "wood")}
            />
            <RadioCollapse
              initState={true}
              title="Price"
              list={price}
              filterHandler={(filters) => filterProducts(filters, "price")}
            />
          </div>

          <div className="right">
            <div className="shop_options">
              <div className="shop_grids clear">
                <div
                  className={`grid_btn ${state.grid ? "" : "active"}`}
                  onClick={() => handleGrid()}
                >
                  <FontAwesomeIcon icon={faTh} />
                </div>
                <div
                  className={`grid_btn ${!state.grid ? "" : "active"}`}
                  onClick={() => handleGrid()}
                >
                  <FontAwesomeIcon icon={faBars} />
                </div>
              </div>
            </div>
            <LoadMoreCards
              grid={state.grid}
              limit={state.limit}
              size={size}
              products={products}
              loadMore={() => loadMoreCards()}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
