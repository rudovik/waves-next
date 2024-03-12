import {
  Arg,
  Mutation,
  Resolver,
  Query,
  Ctx,
  UseMiddleware,
} from "type-graphql"
import { isAuth } from "middlewares/isAuth"
import { isAdmin } from "middlewares/isAdmin"
import { WoodModel } from "models/Wood"
import type { RequestContext } from "types/RequestContext"
import { Wood } from "models/Wood"
import { SuccessResponse } from "types/SuccessResponse"

@Resolver()
export class WoodResolver {
  @Mutation(() => SuccessResponse)
  @UseMiddleware(isAuth())
  @UseMiddleware(isAdmin)
  async addWood(
    @Ctx() ctx: RequestContext,
    @Arg("name") name: string
  ): Promise<SuccessResponse> {
    const wood = new WoodModel({ name })
    await wood.save()

    return { success: true }
  }

  @Query(() => [Wood], { nullable: true })
  async getAllWoods(): Promise<Wood[]> {
    const woods = await WoodModel.find({})
    return woods
  }
}
