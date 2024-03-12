import { ObjectType, Field } from "type-graphql"
import { prop as Property } from "@typegoose/typegoose"
import type { Ref } from "@typegoose/typegoose"
import { ObjectId } from "mongodb"
import { Product } from "models/Product"

@ObjectType()
export class CartItem {
  @Property({ ref: () => Product, requried: true, type: () => ObjectId })
  @Field(() => Product)
  public productId: Ref<Product, ObjectId>

  @Property({ required: true })
  @Field({ nullable: false })
  public quantity: number

  @Property({ required: true })
  @Field({ nullable: false })
  public date: Date
}
