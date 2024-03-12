import { ObjectType, Field } from "type-graphql"
import { prop as Property } from "@typegoose/typegoose"

@ObjectType()
export class ImageType {
  @Property({ required: true, trim: true, unique: true })
  @Field({ nullable: false })
  public url: string

  @Property({ required: true, trim: true, unique: true })
  @Field({ nullable: false })
  public public_id: string
}
