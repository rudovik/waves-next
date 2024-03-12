import { InputType, Field } from "type-graphql"
import { ObjectId } from "mongoose"
import { ObjectIdScalar } from "./object-id.scalar"

@InputType()
export class FiltersInput {
  @Field((type) => [Number], { nullable: "items" })
  price: number[]

  @Field((type) => [ObjectIdScalar], { nullable: "items" })
  wood: ObjectId[]

  @Field((type) => [Number], { nullable: "items" })
  frets: number[]

  @Field((type) => [ObjectIdScalar], { nullable: "items" })
  brand: ObjectId[]
}
