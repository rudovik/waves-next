import { prop as Property, getModelForClass } from "@typegoose/typegoose"
import { ObjectId } from "mongodb"
import { Field, ObjectType } from "type-graphql"
import mongoose from "mongoose"
import { SiteInfoItem } from "types/SiteInfoItem"

@ObjectType({ description: "Site" })
export class Site {
  @Field()
  readonly _id: ObjectId

  @Field({ nullable: false })
  @Property({
    required: true,
    trim: true,
    maxlength: 100,
  })
  public name: string

  @Field(() => [String], { nullable: "items" })
  @Property({
    required: true,
    trim: true,
    type: () => [String],
    default: [],
  })
  public featured: string[]

  @Field(() => [SiteInfoItem], { nullable: "items" })
  @Property({
    required: true,
    type: () => [SiteInfoItem],
    default: [],
  })
  public siteInfo: SiteInfoItem[]
}

if (mongoose.models.Site) {
  delete mongoose.models.Site
}

export const SiteModel = getModelForClass(Site)
