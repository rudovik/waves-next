import { InputType, Field } from "type-graphql"

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: false })
  email: string

  @Field({ nullable: false })
  name: string

  @Field({ nullable: false })
  lastname: string
}
