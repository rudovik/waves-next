import { Product } from "models/Product"
import { ObjectType } from "type-graphql"
import { Field } from "type-graphql"
import { Prop as Property } from "@typegoose/typegoose"

@ObjectType({ description: "Detailed Cart Item" })
export class DetailedCartItem extends Product {
  @Field()
  @Property({ required: true })
  quantity: number
}
