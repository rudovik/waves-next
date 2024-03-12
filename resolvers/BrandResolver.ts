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
import { BrandModel } from "models/Brand"
import type { RequestContext } from "types/RequestContext"
import { Brand } from "models/Brand"
import { SuccessResponse } from "types/SuccessResponse"

@Resolver()
export class BrandResolver {
  @Mutation(() => SuccessResponse)
  @UseMiddleware(isAuth())
  @UseMiddleware(isAdmin)
  async addBrand(
    @Ctx() ctx: RequestContext,
    @Arg("name") name: string
  ): Promise<SuccessResponse> {
    const brand = await BrandModel.create({
      name,
    })

    return { success: true }
  }

  @Query(() => [Brand], { nullable: true })
  async getAllBrands(): Promise<Brand[]> {
    const brands = await BrandModel.find({})
    return brands
  }
}
