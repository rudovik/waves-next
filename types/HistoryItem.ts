import { ObjectType, Field } from "type-graphql"
import { prop as Property } from "@typegoose/typegoose"
import { ObjectId } from "mongodb"

@ObjectType({ description: "User Purchase History Item" })
export class HistoryItem {
  @Field(() => Number, { nullable: false })
  @Property({ required: true, type: Number })
  dateOfPurchase: number

  @Field(() => ObjectId, { nullable: false })
  @Property({ required: true, type: ObjectId })
  productId: ObjectId

  @Field({ nullable: false })
  @Property({ required: true })
  name: string

  @Field({ nullable: false })
  @Property({ required: true })
  brand: string

  // @Field({ nullable: false })
  // @Property({ type: ObjectId, required: true })
  // _id: ObjectId

  @Field({ nullable: false })
  @Property({ required: true })
  price: number

  @Field({ nullable: false })
  @Property({ required: true })
  quantity: number

  @Field({ nullable: false })
  @Property({ required: true })
  paymentId: string
}
