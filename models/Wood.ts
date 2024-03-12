import { prop as Property, getModelForClass } from "@typegoose/typegoose"
import { ObjectId } from "mongodb"
import { Field, ObjectType } from "type-graphql"
import mongoose from "mongoose"

@ObjectType({ description: "Wood" })
export class Wood {
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

if (mongoose.models.Wood) {
  delete mongoose.models.Wood
}

export const WoodModel = getModelForClass(Wood)
