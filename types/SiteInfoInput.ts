import { InputType, Field } from "type-graphql"

@InputType()
export class SiteInfoInput {
  @Field()
  address: string

  @Field()
  hours: string

  @Field()
  phone: string

  @Field()
  email: string
}
