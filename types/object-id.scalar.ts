import { GraphQLScalarType, Kind } from "graphql"
import { ObjectId } from "mongodb"

export const ObjectIdScalar = new GraphQLScalarType({
  name: "ObjectId",
  description: "Mongo id scalar type",
  parseValue(value) {
    if (typeof value === "string") {
      return new ObjectId(value)
    }
    throw new Error("GraphQL ObjectId Scalar parser exptected a `string`")
  },
  serialize(value) {
    // console.log(value)
    if (value instanceof ObjectId) {
      return value.toHexString()
    } else if (typeof value === "string") {
      return new ObjectId(value)
    }
    throw new Error("GraphQL ObjectId serializer expected an `ObjectId` object")
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new ObjectId(ast.value)
    }
    return null
  },
})
