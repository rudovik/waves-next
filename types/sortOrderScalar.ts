import { GraphQLScalarType, Kind } from "graphql"

import { SortOrder } from "mongoose"

type Mapish = { [key in SortOrder]: boolean }

const sortVariants: Mapish = {
  asc: true,
  ascending: true,
  desc: true,
  descending: true,
  [1]: true,
  [-1]: true,
}

export const SortOrderScalar = new GraphQLScalarType({
  name: "SortOrderScalar",
  description: "Mongoose Sort Order Scalar",
  parseValue(value) {
    if (typeof value === "string" && sortVariants[value]) {
      return value
    } else if (typeof value === "number" && sortVariants[value]) {
      return value
    }
    throw new Error("Mongoose Sort Order Scalar parser exptected a right value")
  },
  serialize(value) {
    // console.log(value)
    if (typeof value === "number" && sortVariants[value]) {
      return value
    } else if (typeof value === "string" && sortVariants[value]) {
      return value
    }
    throw new Error(
      "Mongoose Sort Order Scalar serializer expected a right value"
    )
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING && sortVariants[ast.value]) {
      return ast.value
    }
    if (ast.kind === Kind.INT && sortVariants[ast.value]) {
      return ast.value
    }
    return null
  },
})
