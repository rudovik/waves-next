"use client"

import { PageTop } from "components/PageTop"
import { useGetProductsByIdSuspenseQuery } from "lib/graphql/GetProductsById.graphql"
import { ProductInfo } from "components/ProductInfo"
import { ProductImages } from "components/ProductImages"
import { useAddProductToCartMutation } from "lib/graphql/AddProductToCart.graphql"
import { useAuth } from "lib/useAuth"

export default function ProductPage({ params: { id } }) {
  const {
    data: {
      getProductsById: [product],
    },
    error,
  } = useGetProductsByIdSuspenseQuery({
    variables: {
      items: `${id}`,
      type: "array",
    },
  })
  const [addProductToCartMutation, { data, loading, error: err }] =
    useAddProductToCartMutation()
  const { user, refetchAuth } = useAuth()

  // console.log(product.images)

  async function addToCart(id) {
    if (user && user.isAuth) {
      const {
        data: {
          addProductToCart: { success },
        },
      } = await addProductToCartMutation({
        variables: {
          productId: id,
        },
      })
      await refetchAuth()
      // console.log(success)
    } else {
      console.log("You should to log in")
    }
  }

  return (
    <div>
      <PageTop title="Product Detail" />
      <div className="container">
        {product ? (
          <div className="product_detail_wrapper">
            <div className="left">
              <div style={{ width: "500px" }}>
                <ProductImages product={product} />
              </div>
            </div>
            <div className="right">
              <ProductInfo
                product={product}
                addToCart={(id) => addToCart(id)}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
