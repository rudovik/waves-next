import {
  Resolver,
  Query,
  Arg,
  Mutation,
  UseMiddleware,
  Ctx,
} from "type-graphql"
import { ObjectId } from "mongodb"
import { User, UserModel } from "models/User"
import { ObjectIdScalar } from "types/object-id.scalar"
import { isAuth } from "middlewares/isAuth"
import type { RequestContext } from "types/RequestContext"
import { SuccessResponse } from "types/SuccessResponse"
import { isDocument } from "@typegoose/typegoose"
import { PayPalCreateOrderResponse } from "types/PaypalCreateOrderResponse"
import { PayPalCaptureOrderResponse } from "types/PayPalCaptureOrderResponse"
import { createOrder, captureOrder } from "lib/paypal"
import { PaymentModel } from "models/Payment"
import { ProductModel } from "models/Product"
import { UpdateProfileInput } from "types/UpdateProfileInput"

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  async user(@Arg("userId", () => ObjectIdScalar) userId: ObjectId) {
    return await UserModel.findById(userId)
  }

  @Mutation(() => SuccessResponse)
  @UseMiddleware(isAuth())
  // @UseMiddleware(isAdmin)
  async updateProfile(
    @Ctx() { user }: RequestContext,
    @Arg("profileInput")
    { email, name, lastname }: UpdateProfileInput
  ): Promise<SuccessResponse> {
    user.name = name
    user.lastname = lastname
    user.email = email

    await user.save()

    // await UserModel.findOneAndUpdate({
    //   _id: ctx.user._id
    // }, {$set: {email, name, lastname}}, {new: true})

    return {
      success: true,
    }
  }

  @Mutation(() => SuccessResponse)
  @UseMiddleware(isAuth())
  // @UseMiddleware(isAdmin)
  async addProductToCart(
    @Ctx() ctx: RequestContext,
    @Arg("productId", () => ObjectIdScalar) productId: ObjectId
  ): Promise<SuccessResponse> {
    let duplicate = false

    const user = ctx.user

    user.cart.forEach((item) => {
      if (item.productId._id.toHexString() === productId.toHexString()) {
        duplicate = true
      }
    })

    if (duplicate) {
      await UserModel.findOneAndUpdate(
        { _id: ctx.user._id, "cart.productId": productId },
        { $inc: { "cart.$.quantity": 1 } },
        { new: true }
      )
    } else {
      await UserModel.findOneAndUpdate(
        {
          _id: ctx.user._id,
        },
        {
          $push: {
            cart: {
              productId: productId,
              quantity: 1,
              date: Date.now(),
            },
          },
        },
        { new: true }
      )
    }

    // await user.save()

    return { success: true }
  }

  @Mutation(() => SuccessResponse)
  @UseMiddleware(isAuth())
  // @UseMiddleware(isAdmin)
  async removeProductFromCart(
    @Ctx() ctx: RequestContext,
    @Arg("productId", () => ObjectIdScalar) productId: ObjectId
  ): Promise<SuccessResponse> {
    let duplicate = false

    const user = ctx.user

    user.cart = user.cart.filter(
      (item) => item.productId._id.toHexString() !== productId.toHexString()
    )

    await user.save()

    return { success: true }
  }

  @Mutation(() => PayPalCreateOrderResponse)
  @UseMiddleware(isAuth({ populateCart: true }))
  // @UseMiddleware(isAdmin)
  async createOrder(
    @Ctx() ctx: RequestContext
    // @Arg("cart", (type) => [OrderCartItem]) cart: OrderCartItem[]
  ): Promise<PayPalCreateOrderResponse> {
    let total = 0

    const user = ctx.user.cart.forEach((item) => {
      if (isDocument(item.productId)) {
        total += item.quantity * item.productId.price
      }
    })

    try {
      const { jsonResponse } = await createOrder(total)
      // console.log(jsonResponse)
      return jsonResponse
    } catch (error) {
      console.log("Failed to create order: ", error)
    }
  }

  @Mutation(() => PayPalCaptureOrderResponse)
  @UseMiddleware(isAuth({ populateCart: true }))
  async captureOrder(
    @Arg("orderId", (type) => String) orderId: String,
    @Ctx() ctx: RequestContext
  ): Promise<PayPalCaptureOrderResponse> {
    try {
      const { jsonResponse } = await captureOrder(orderId)
      const { id, status } = jsonResponse

      // console.log("id: " + id)
      // console.log("status: " + status)

      if (status === "COMPLETED") {
        const history = []

        ctx.user.cart.forEach((item) => {
          if (isDocument(item.productId) && isDocument(item.productId.brand)) {
            ctx.user.history.push({
              dateOfPurchase: Date.now(),
              name: item.productId.name,
              brand: item.productId.brand.name,
              productId: item.productId._id,
              price: item.productId.price,
              quantity: item.quantity,
              paymentId: id,
            })
          }
        })

        history.forEach(
          async (product) => {
            await ProductModel.updateOne(
              { _id: product._id },
              {
                $inc: { sold: product.quantity },
              }
            )
          },
          { new: false }
        )

        ctx.user.cart = []
        // ctx.user.history = [...history, ...ctx.user.history]
        await ctx.user.save()

        const transactionData = {} as any
        transactionData.user = {
          _id: ctx.user._id,
          name: ctx.user.name,
          lastname: ctx.user.lastname,
          email: ctx.user.email,
        }
        transactionData.data = JSON.stringify(jsonResponse)
        transactionData.products = history
        const payment = new PaymentModel(transactionData)
        await payment.save()
      }

      const response = { id, status }
      return response
    } catch (error) {
      console.log("Failed to create order: ", error)
    }
  }

  // @Mutation(() => PayPalCaptureOrderResponse)
  // @UseMiddleware(isAuth({ populateCart: true }))
  // async handleSuccessBuy(
  //   @Ctx() ctx: RequestContext,
  //   @Arg("paymentId", (type) => String) paymentId: string,
  //   @Arg("paymentData", (type) => String) paymentData: string
  // ): Promise<any> {
  //   const history = []
  //   const transactionData = {} as any

  //   // user history
  //   ctx.user.cart.forEach((item) => {
  //     if (isDocument(item.productId) && isDocument(item.productId.brand)) {
  //       history.push({
  //         dateOfPurchase: Date.now(),
  //         name: item.productId.name,
  //         brand: item.productId.brand.name,
  //         _id: item.productId._id,
  //         price: item.productId.price,
  //         quantity: item.quantity,
  //         paymentId: paymentId,
  //       })
  //     }
  //   })

  //   history.forEach(
  //     async (product) => {
  //       await ProductModel.updateOne(
  //         { _id: product._id },
  //         {
  //           $inc: { sold: product.quantity },
  //         }
  //       )
  //     },
  //     { new: false }
  //   )

  //   ctx.user.cart = []
  //   ctx.user.history = [...ctx.user.history, ...history]
  //   await ctx.user.save()

  //   // await ctx.user.save()

  //   // const updatedUser = await UserModel.findOneAndUpdate(
  //   //   { _id: ctx.user._id },
  //   //   { $push: { history }, $set: { cart: [] } },
  //   //   { new: true }
  //   // )

  //   // Payemnts Dash
  //   transactionData.user = {
  //     _id: ctx.user._id,
  //     name: ctx.user.name,
  //     lastname: ctx.user.lastname,
  //     email: ctx.user.email,
  //   }
  //   transactionData.data = paymentData
  //   transactionData.products = history

  //   const payment = new PaymentModel(transactionData)
  //   await payment.save()
  // }
}
