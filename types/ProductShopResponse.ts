import { ObjectType, Field } from "type-graphql"
import { Product } from "models/Product"

@ObjectType()
export class ProductShopResponse {
  @Field()
  size: number

  @Field(() => [Product], { nullable: "items" })
  products: Product[]
}
