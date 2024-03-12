import { InputType, Field } from "type-graphql"
import { ImageInput } from "./ImageInput"

@InputType()
export class ProductInput {
  @Field()
  name: string

  @Field()
  description: string

  @Field()
  price: number

  @Field()
  brand: string

  @Field()
  shipping: boolean

  @Field()
  available: boolean

  @Field()
  wood: string

  @Field()
  frets: number

  @Field()
  publish: boolean

  @Field(() => [ImageInput], { nullable: true })
  images?: ImageInput[]
}
