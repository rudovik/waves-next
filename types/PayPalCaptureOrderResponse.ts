import { ObjectType, Field } from "type-graphql"
// import { PayPalLinkItem } from "./PayPalLinkItem"

@ObjectType()
export class PayPalCaptureOrderResponse {
  @Field(() => String, { nullable: false })
  public id: string

  @Field(() => String, { nullable: false })
  public status: string

  // @Field(() => null, { nullable: true })
  // public payment_source?: null

  // @Field(() => null, { nullable: true })
  // purchase_units: null

  // @Field(() => null, { nullable: true })
  // payer: null

  // @Field(() => [PayPalLinkItem])
  // links: PayPalLinkItem[]
}
