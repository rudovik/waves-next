import {
  ReturnModelType,
  DocumentType,
  prop as Property,
  getModelForClass,
  pre,
} from "@typegoose/typegoose"
import { ObjectId } from "mongodb"
import { Field, ObjectType } from "type-graphql"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { CartItem } from "types/CartItem"
import { HistoryItem } from "types/HistoryItem"
// import type { Cart } from "types/Cart"

@pre<User>("save", async function () {
  let user = this

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10)
  }
})
@ObjectType({ description: "User" })
export class User {
  @Field()
  readonly _id: ObjectId

  @Field()
  @Property({ required: true, trim: true, unique: true })
  public email: string

  @Field()
  @Property({ required: true, maxlength: 100 })
  public name: string

  @Field()
  @Property({ required: true, maxlength: 100 })
  public lastname: string

  @Property({ required: true, minlength: 5 })
  password: string

  @Field(() => [CartItem], { nullable: "items" })
  @Property({ type: () => [CartItem] })
  public cart: CartItem[]

  @Field(() => [HistoryItem], { nullable: "items" })
  @Property({ type: () => [HistoryItem], default: [] })
  public history: HistoryItem[]

  @Field()
  @Property({ default: 0 })
  public role: number

  @Field({ nullable: true })
  @Property()
  public token?: string

  async comparePassword(this: DocumentType<User>, candidatePassword: string) {
    const isValid = await bcrypt.compare(candidatePassword, this.password)
    return isValid
  }

  async generateToken(this: DocumentType<User>) {
    const user = this
    const token = jwt.sign(user._id.toHexString(), process.env.SESSION_SECRET)
    user.token = token
  }

  // async populateCart(this: DocumentType<User>) {
  //   const user = this
  //   this.cart.forEach(cartItem => {
  //     cartItem.productId
  //     cartItem.quantity
  //   })
  // }

  static async findByToken(
    this: ReturnModelType<typeof User>,
    token: string,
    populateCart: boolean = false
  ) {
    let User = this

    const userId = jwt.verify(token, process.env.SESSION_SECRET)

    let user
    if (populateCart) {
      user = await User.findOne({ _id: userId, token: token }).populate({
        path: "cart",
        populate: {
          path: "productId",
          model: "Product",
          populate: [
            { path: "wood", model: "Wood" },
            { path: "brand", model: "Brand" },
          ],
        },
      })
    } else {
      user = await User.findOne({ _id: userId, token: token })
    }

    if (!user) throw new Error("Error")

    return user
  }
}

if (mongoose.models.User) {
  delete mongoose.models.User
}

export const UserModel = getModelForClass(User)
