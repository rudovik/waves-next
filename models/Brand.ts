import { prop as Property, getModelForClass } from "@typegoose/typegoose"
import { ObjectId } from "mongodb"
import { Field, ObjectType } from "type-graphql"
import mongoose from "mongoose"

@ObjectType({ description: "Brand" })
export class Brand {
  @Field()
  readonly _id: ObjectId

  @Field()
  @Property({
    required: true,
    trim: true,
    unique: true,
    maxlength: 100,
    type: () => String,
  })
  public name: string
}

if (mongoose.models.Brand) {
  delete mongoose.models.Brand
}

export const BrandModel = getModelForClass(Brand)
