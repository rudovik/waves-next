"use client"

import { useAuth } from "lib/useAuth"
import { useAddProductToCartMutation } from "lib/graphql/AddProductToCart.graphql"
import { MyButton } from "./MyButton"

export const Card = ({
  grid,
  images,
  brand,
  name,
  price,
  _id,
  description,
}) => {
  const { user, refetchAuth } = useAuth()
  const [addProductToCartMutation, { data, loading, error, client }] =
    useAddProductToCartMutation()

  const renderCardImage = (images: any[]) => {
    if (images.length > 0) {
      return images[0].url
    } else {
      return "/images/image_not_available.png"
    }
  }

  // console.log(images)

  async function addProductToCart() {
    const {
      data: {
        addProductToCart: { success },
      },
    } = await addProductToCartMutation({
      variables: {
        productId: _id,
      },
    })

    client.cache.evict({ fieldName: "getCartProducts" })

    await refetchAuth()
    // console.log(success)
  }

  return (
    <div className={`card_item_wrapper ${grid}`}>
      <div
        className="image"
        style={{ background: `url(${renderCardImage(images)}) no-repeat` }}
      ></div>
      <div className="action_container">
        <div className="tags">
          <div className="brand">{brand.name}</div>
          <div className="name">{name}</div>
          <div className="price">{price}$</div>
        </div>

        {grid && <div className="description">{description}</div>}
        <div className="actions">
          <div className="button_wrapp">
            <MyButton
              type="default"
              altClass="card_link"
              title="View Product"
              linkTo={`/product_details/${_id}`}
              addStyles={{
                margin: "10px 0 0 0 ",
              }}
            />
          </div>
          <div className="button_wrap">
            <MyButton
              type="bag_link"
              runAction={() => {
                user && user.isAuth
                  ? addProductToCart()
                  : console.log("you need to log in")
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
