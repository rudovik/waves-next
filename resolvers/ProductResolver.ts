import {
  Arg,
  Mutation,
  Resolver,
  Query,
  Ctx,
  UseMiddleware,
  registerEnumType,
} from "type-graphql"
import { isAuth } from "middlewares/isAuth"
import { isAdmin } from "middlewares/isAdmin"
import { ProductModel } from "models/Product"
import type { RequestContext } from "types/RequestContext"
import { Product } from "models/Product"
import { SuccessResponse } from "types/SuccessResponse"
import { ProductInput } from "types/ProductInput"
import mongoose from "mongoose"
import type { SortOrder as SortOrderType } from "mongoose"
import { SortOrderScalar } from "types/sortOrderScalar"
import { FiltersInput } from "types/FiltersInput"
import { ProductShopResponse } from "types/ProductShopResponse"
import { DetailedCartItem } from "types/DetailedCartItem"
import { User } from "models/User"
import { CartItem } from "types/CartItem"
// import mongoose from "mongoose"

const a: "asc" | "desc" | 1 | -1 = 1

export enum SortBy {
  sold = "sold",
  createdAt = "createdAt",
  _id = "_id",
}

registerEnumType(SortBy, {
  name: "SortBy",
  description: "Allowable sort order values",
})

@Resolver()
export class ProductResolver {
  @Mutation(() => SuccessResponse)
  @UseMiddleware(isAuth())
  @UseMiddleware(isAdmin)
  async addProduct(
    @Ctx() ctx: RequestContext,
    @Arg("productInput")
    {
      name,
      description,
      price,
      brand,
      shipping,
      available,
      wood,
      frets,
      publish,
      images,
    }: ProductInput
  ): Promise<SuccessResponse> {
    const product = new ProductModel({
      name,
      description,
      brand,
      price,
      shipping,
      available,
      wood,
      frets,
      publish,
      images,
    })

    await product.save()

    return { success: true }
  }

  @Query(() => [Product], { nullable: true })
  async getProductsById(
    @Arg("type") type: string,
    @Arg("items") items: string
  ): Promise<Product[]> {
    let stringIds = items.split(",")
    // console.log(stringIds)
    let objectIds = stringIds.map((item) => {
      return new mongoose.Types.ObjectId(item.trim()).toHexString()
    })

    // console.log(objectIds)

    const products = await ProductModel.find({ _id: { $in: objectIds } })
      .populate("brand")
      .populate("wood")
    return products
  }

  @Query(() => [Product], { nullable: true })
  async getsProductsByArrival(): Promise<Product[]> {
    const products = await ProductModel.find({})
    return products
  }

  @Query(() => [Product])
  async getSortedProducts(
    @Arg("order", () => SortOrderScalar, { nullable: true })
    order?: SortOrderType,
    @Arg("sortBy", () => SortBy, { nullable: true })
    sortBy?: SortBy,
    @Arg("limit", { nullable: true }) limit?: number
  ): Promise<Product[]> {
    order = order ?? "asc"
    sortBy = sortBy ?? SortBy._id
    limit = limit ?? 100
    // console.log("order: ", order)
    // console.log("sortBy: ", sortBy)
    // console.log("limit: ", limit)
    const products = await ProductModel.find({})
      .populate("brand")
      .populate("wood")
      .sort([[sortBy, order]])
      .limit(limit)
    return products
  }

  @Query(() => [Product], { nullable: true })
  async getAllProducts(): Promise<Product[]> {
    const products = await ProductModel.find({})
    return products
  }

  @Query(() => ProductShopResponse)
  async getProductsToShop(
    @Arg("filters", { nullable: true })
    filters?: FiltersInput,
    @Arg("order", () => SortOrderScalar, { nullable: true })
    order?: SortOrderType,
    @Arg("sortBy", () => SortBy, { nullable: true })
    sortBy?: SortBy,
    @Arg("limit", { nullable: true }) limit?: number,
    @Arg("skip", { nullable: true }) skip?: number
  ): Promise<ProductShopResponse> {
    order = order ?? "desc"
    sortBy = sortBy ?? SortBy._id
    limit = limit ?? 6
    skip = skip ?? 0
    filters = filters ?? { price: [], brand: [], frets: [], wood: [] }

    let findArgs = {}

    for (let key in filters) {
      if (filters[key].length > 0) {
        if (key === "price") {
          findArgs[key] = {
            $gte: filters[key][0],
            $lte: filters[key][1],
          }
        } else {
          findArgs[key] = filters[key]
        }
      }
    }

    findArgs["publish"] = true

    const products = await ProductModel.find(findArgs)
      .populate("brand")
      .populate("wood")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
    return {
      size: products.length,
      products,
    }
  }

  @Query(() => [CartItem], { nullable: true })
  @UseMiddleware(isAuth({ populateCart: true }))
  async getCartProducts(@Ctx() ctx: RequestContext): Promise<CartItem[]> {
    return ctx.user.cart
  }
}
