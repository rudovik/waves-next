import { ObjectType, Field, InputType } from "type-graphql"
import { prop as Property } from "@typegoose/typegoose"
import { ObjectId } from "mongodb"
import { ObjectIdScalar } from "./object-id.scalar"

@InputType()
export class OrderCartItem {
  @Property({ type: () => ObjectId, requried: true })
  @Field(() => ObjectIdScalar)
  public productId: ObjectId

  @Property({ required: true })
  @Field({ nullable: false })
  public quantity: number

  @Property({ required: true })
  @Field({ nullable: false })
  public price: number
}
