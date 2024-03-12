import { ObjectType, Field } from "type-graphql"
import { prop as Property } from "@typegoose/typegoose"
import { ObjectId } from "mongodb"
import { ObjectIdScalar } from "./object-id.scalar"

@ObjectType()
export class PaymentUser {
  @Field()
  readonly _id: ObjectId

  @Property({ required: true, trim: true })
  @Field({ nullable: false })
  public name: string

  @Property({ required: true, trim: true })
  @Field({ nullable: false })
  public lastname: string

  @Property({ required: true, trim: true })
  @Field({ nullable: false })
  public email: string
}
