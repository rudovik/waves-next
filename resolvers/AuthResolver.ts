import {
  Arg,
  Mutation,
  Resolver,
  Query,
  Ctx,
  UseMiddleware,
} from "type-graphql"
import { AuthResponse } from "types/AuthResponse"
import { isAuth } from "middlewares/isAuth"
import { UserModel } from "models/User"
import { RegisterInput } from "types/RegisterInput"
import { UserResponse } from "types/UserResponse"
import { AuthInput } from "types/AuthInput"
import type { RequestContext } from "types/RequestContext"
import { SuccessResponse } from "types/SuccessResponse"

@Resolver()
export class AuthResolver {
  @Query(() => AuthResponse, { nullable: true })
  @UseMiddleware(isAuth())
  async auth(@Ctx() ctx: RequestContext): Promise<AuthResponse> {
    return {
      isAdmin: ctx.user.role === 0 ? false : true,
      isAuth: true,
      email: ctx.user.email,
      name: ctx.user.name,
      lastname: ctx.user.lastname,
      role: ctx.user.role,
      cart: ctx.user.cart,
      history: ctx.user.history,
    }
  }

  @Mutation(() => SuccessResponse)
  async register(
    @Arg("input") { email, password, name, lastname }: RegisterInput
  ): Promise<SuccessResponse> {
    const existingUser = await UserModel.findOne({ email })

    if (existingUser) {
      throw new Error("Email already in use")
    }

    // const hashedPassword = await bcrypt.hash(password, 10)
    const user = new UserModel({
      email,
      password,
      name,
      lastname,
    })

    // console.log(user.toJSON())

    // const length = user.cart.length
    // const el0 = user.cart[0].productId
    // const el1 = user.cart[1].productId
    // console.log(el0)
    // console.log(el1)

    // user.generateToken()
    // console.log(user)
    await user.save()
    // console.log(cart)

    return { success: true }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("input") { email, password }: AuthInput
  ): Promise<UserResponse> {
    const existingUser = await UserModel.findOne({ email })

    if (!existingUser) {
      throw new Error("Invalid Login")
    }

    const isValid = await existingUser.comparePassword(password)

    if (!isValid) {
      throw new Error("Invalid Login")
    }

    existingUser.generateToken()

    await existingUser.save()

    return { user: existingUser }
  }

  @Mutation(() => SuccessResponse)
  @UseMiddleware(isAuth())
  async logout(@Ctx() ctx: RequestContext): Promise<SuccessResponse> {
    await UserModel.findOneAndUpdate(
      {
        _id: ctx.user._id,
      },
      { token: null }
    )

    return {
      success: true,
    }
  }
}
