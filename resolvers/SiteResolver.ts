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
import { Site } from "models/Site"
import { SiteModel } from "models/Site"
import { SiteInfoInput } from "types/SiteInfoInput"

@Resolver()
export class SiteResolver {
  @Mutation(() => SuccessResponse)
  @UseMiddleware(isAuth())
  @UseMiddleware(isAdmin)
  async updateSiteInfo(
    @Arg("name") name: string,
    @Arg("siteInfoInput") { address, hours, phone, email }: SiteInfoInput
  ): Promise<SuccessResponse> {
    const site = await SiteModel.findOne({ name })
    site.siteInfo[0] = { address, hours, phone, email }
    await site.save()

    return { success: true }
  }

  @Query(() => Site, { nullable: false })
  async getSiteData(): Promise<Site> {
    const site = await SiteModel.findOne({})
    // console.log(site)
    return site
  }
}
