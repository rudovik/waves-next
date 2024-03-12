import { ObjectType, Field } from "type-graphql"

@ObjectType()
export class SuccessResponse {
  @Field()
  success: boolean
}
