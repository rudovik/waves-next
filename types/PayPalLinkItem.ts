import { ObjectType, Field, registerEnumType } from "type-graphql"

enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
}
registerEnumType(RequestMethod, {
  name: "RequestMethod",
  description: "Allowed request methods",
})

enum RequestRelation {
  SELF = "self",
  UPDATE = "update",
  APPROVE = "approve",
  CAPTURE = "capture",
}
registerEnumType(RequestRelation, {
  name: "RequestRelation",
  description: "Allowed request relations",
})

@ObjectType()
export class PayPalLinkItem {
  @Field(() => String, { nullable: false })
  public href: string

  @Field(() => RequestRelation, { nullable: false })
  public rel: RequestRelation

  @Field(() => RequestMethod, { nullable: false })
  public method: RequestMethod
}
