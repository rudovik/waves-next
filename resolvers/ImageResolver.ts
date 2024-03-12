import { Arg, Mutation, Resolver, Ctx, UseMiddleware } from "type-graphql"
import { isAuth } from "middlewares/isAuth"
import { isAdmin } from "middlewares/isAdmin"
import type { RequestContext } from "types/RequestContext"
import { SuccessResponse } from "types/SuccessResponse"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

@Resolver()
export class ImageResolver {
  @Mutation(() => SuccessResponse)
  @UseMiddleware(isAuth())
  @UseMiddleware(isAdmin)
  async removeImage(
    @Ctx() ctx: RequestContext,
    @Arg("public_id") public_id: string
  ): Promise<SuccessResponse> {
    await cloudinary.uploader.destroy(public_id)

    return { success: true }
  }
}
