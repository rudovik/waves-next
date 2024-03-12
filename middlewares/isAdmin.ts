import { MiddlewareFn } from "type-graphql"
import { RequestContext } from "types/RequestContext"

export const isAdmin: MiddlewareFn<RequestContext> = async (
  { context },
  next
) => {
  if (context.user.role === 0) {
    throw new Error("You are not allowed, get out now.")
  }
  return next()
}
