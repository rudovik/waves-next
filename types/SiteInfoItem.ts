import { ObjectType, Field, InputType } from "type-graphql"
import { prop as Property } from "@typegoose/typegoose"

@ObjectType()
export class SiteInfoItem {
  @Property({ required: true, maxlength: 100, trim: true })
  @Field({ nullable: false })
  public address: string

  @Property({ required: true, maxlength: 100, trim: true })
  @Field({ nullable: false })
  public hours: string

  @Property({ required: true, maxlength: 100, trim: true })
  @Field({ nullable: false })
  public phone: string

  @Property({ required: true, maxlength: 100, trim: true })
  @Field({ nullable: false })
  public email: string
}
