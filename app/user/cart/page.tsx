"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFrown } from "@fortawesome/free-solid-svg-icons"
import { faSmile } from "@fortawesome/free-solid-svg-icons"
import { useAuth } from "lib/useAuth"
import { useState, useEffect } from "react"

import { useGetCartProductsSuspenseQuery } from "lib/graphql/GetCartProducts.graphql"
import { ProductBlock } from "components/ProductBlock"
import { useRemoveProductFromCartMutation } from "lib/graphql/RemoveProductFromCart.graphql"
import { useCreateOrderMutation } from "lib/graphql/CreateOrder.graphql"
import { useCaptureOrderMutation } from "lib/graphql/PayPalCatupreOrder.graphql"

import { PayPalButtons } from "@paypal/react-paypal-js"

import { useAuthSuspenseQuery } from "lib/graphql/Auth.graphql"

// email: sb-mwjbu3959446@personal.example.com
// password: >H!.irV5
// Credit card number: 4032034865325354
// Credit cart type: VISA
// Expiration data: 01/2026
// Account ID: FV28XNWGMR87L

export default function CartPage() {
  const { user, authCookie, authParams, refetchAuth } = useAuth()
  const [state, setState] = useState({
    showSuccess: false,
  })
  const {
    data: { getCartProducts: userCart },
    refetch: refetchCart,
  } = useGetCartProductsSuspenseQuery({
    ...authParams,
  })
  const [removeProductFromCart] = useRemoveProductFromCartMutation()

  const [createOrderMutation] = useCreateOrderMutation()
  const [captureOrderMutation] = useCaptureOrderMutation()

  useEffect(() => {
    // console.log(userCart.length)
    userCart.length > 0 && calculateTotal(userCart)
  }, [userCart])

  function calculateTotal(cart) {
    if (cart.legnth <= 0) return
    let total = 0

    cart.forEach((cartItem) => {
      total += cartItem.quantity * parseInt(cartItem.productId.price, 10)
    })

    return total
  }

  // console.log(userCart)

  async function removeFromCart(id) {
    await removeProductFromCart({
      variables: {
        productId: id,
      },
    })
    await refetchAuth()
    await refetchCart()

    // console.log(id)
  }

  const showNoItemMessage = () => (
    <div className="cart_no_items">
      <FontAwesomeIcon icon={faFrown} />
      <div>You have no items</div>
    </div>
  )

  function onError(data) {
    console.log(data)
  }

  async function onApprove(data) {
    console.log(data)
    const {
      data: {
        captureOrder: { status },
      },
    } = await captureOrderMutation({
      variables: {
        orderId: data.orderID,
      },
    })

    await refetchAuth()
    await refetchCart()

    // console.log(status)
  }

  function onCancel(data) {
    console.log(data)
  }

  async function createOrder() {
    const {
      data: {
        createOrder: { id: orderId },
      },
    } = await createOrderMutation()
    return orderId
  }

  return (
    <>
      <h1>My cart</h1>
      <div className="user_cart">
        <ProductBlock
          products={userCart}
          type="cart"
          removeItem={(id) => removeFromCart(id)}
        />
        {userCart.length > 0 ? (
          <div className="user_cart_sum">
            <div>Total amount $ {calculateTotal(userCart)}</div>
          </div>
        ) : state.showSuccess ? (
          <div className="cart_success">
            <FontAwesomeIcon icon={faSmile} />
            <div>THANK YOU</div>
            <div>YOUR ORDER IS NOW COMPLETE</div>
          </div>
        ) : (
          showNoItemMessage()
        )}
      </div>

      {userCart.length > 0 ? (
        <div className="paypal_button_container">
          <PayPalButtons
            style={{ layout: "horizontal" }}
            onError={(data) => onError(data)}
            onCancel={(data) => onCancel(data)}
            onApprove={(data) => onApprove(data)}
            createOrder={() => createOrder()}
          />
        </div>
      ) : null}
    </>
  )
}
