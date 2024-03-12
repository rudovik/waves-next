import { MiddlewareFn } from "type-graphql"
import { RequestContext } from "types/RequestContext"
import { UserModel } from "models/User"

export const isAuth = (options = null): MiddlewareFn<RequestContext> => {
  const { populateCart } = options ?? false
  return async function isAuthMiddleware({ context }, next) {
    const authCookie = context.req.cookies.get("w_auth")
    const token = authCookie && authCookie.value

    if (!token) {
      throw new Error("jwt token must be provided")
    }

    const user = await UserModel.findByToken(token, populateCart)

    if (!user) throw new Error("There is no such a user")

    context.token = token
    context.user = user

    return next()
  }
}
