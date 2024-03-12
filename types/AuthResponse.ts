import { ObjectType, Field } from "type-graphql"
import { CartItem } from "./CartItem"
import { HistoryItem } from "./HistoryItem"

@ObjectType()
export class AuthResponse {
  @Field()
  isAdmin: boolean

  @Field()
  isAuth: boolean

  @Field()
  email: string

  @Field()
  name: string

  @Field()
  lastname: string

  @Field()
  role: number

  @Field((type) => [CartItem])
  cart: CartItem[]

  @Field((type) => [HistoryItem])
  history: HistoryItem[]
  // @Field(() => String, { nullable: false })
  // token!: string
}
