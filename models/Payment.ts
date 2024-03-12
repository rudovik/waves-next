import { prop as Property, getModelForClass } from "@typegoose/typegoose"
import { ObjectId } from "mongodb"
import { Field, ObjectType } from "type-graphql"
import mongoose from "mongoose"
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"
import { HistoryItem } from "types/HistoryItem"
import { PaymentUser } from "types/PaymentUser"

const a: [string] = ["Hello"]

@ObjectType({ description: "Payment" })
export class Payment extends TimeStamps {
  @Field()
  readonly _id: ObjectId

  @Field(() => [PaymentUser], { nullable: "items" })
  @Property({ type: () => [PaymentUser], default: [] })
  public user: mongoose.Types.Array<PaymentUser>

  @Field(() => String, { nullable: false })
  @Property({ type: () => String, required: true })
  public data: string

  @Field(() => [HistoryItem], { nullable: "items" })
  @Property({ type: () => [HistoryItem], default: [] })
  public products: mongoose.Types.Array<HistoryItem>
}

if (mongoose.models.Payment) {
  delete mongoose.models.Payment
}

export const PaymentModel = getModelForClass(Payment)
