import { PayPalLinkItem } from "./PayPalLinkItem"
import { ObjectType, Field, registerEnumType } from "type-graphql"

@ObjectType()
export class PayPalCreateOrderResponse {
  @Field({ nullable: false })
  public id: string

  @Field({ nullable: false })
  public status: string

  @Field(() => [PayPalLinkItem], { nullable: false })
  public links: PayPalLinkItem[]
}
