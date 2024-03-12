import { prop as Property, getModelForClass } from "@typegoose/typegoose"
import { ObjectId } from "mongodb"
import { Field, ObjectType } from "type-graphql"
import mongoose from "mongoose"
import { Brand } from "./Brand"
import { Wood } from "./Wood"
import type { Ref } from "@typegoose/typegoose"
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"
import { ImageType } from "types/ImageType"

const a: [string] = ["Hello"]

@ObjectType({ description: "Product" })
export class Product extends TimeStamps {
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

  @Field()
  @Property({
    required: true,
    trim: true,
    maxlength: 10000,
    type: () => String,
  })
  public description: string

  @Field()
  @Property({
    required: true,
    max: 10000,
    type: () => Number,
  })
  public price: number

  @Field(() => Brand)
  @Property({ ref: () => Brand, required: true, type: () => ObjectId })
  public brand: Ref<Brand>

  @Field()
  @Property({ required: true })
  shipping: boolean

  @Field()
  @Property({ required: true })
  available: boolean

  @Field(() => Wood)
  @Property({ ref: () => Wood, required: true, type: () => ObjectId })
  public wood: Ref<Wood>

  @Field()
  @Property({ required: true })
  public frets: number

  @Field()
  @Property({ required: true, max: 100, default: 0 })
  public sold: number

  @Field()
  @Property({ required: true })
  public publish: boolean

  @Field(() => [ImageType], { nullable: "items" })
  @Property({ type: () => [ImageType], default: [] })
  public images: mongoose.Types.Array<ImageType>

  @Field()
  public createdAt: Date
}

if (mongoose.models.Product) {
  delete mongoose.models.Product
}

export const ProductModel = getModelForClass(Product)
