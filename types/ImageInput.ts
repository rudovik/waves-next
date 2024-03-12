import { InputType, Field } from "type-graphql"

@InputType()
export class ImageInput {
  @Field()
  public_id: string

  @Field()
  url: string
}
