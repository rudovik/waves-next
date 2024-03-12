import "reflect-metadata"
import { buildSchema } from "type-graphql"
import { ObjectId } from "mongodb"
import path from "path"
import { NextApiRequest, NextApiResponse } from "next"
import { ObjectIdScalar } from "types/object-id.scalar"
import { TypegooseMiddleware } from "middlewares/typegoose"
import { UserResolver } from "resolvers/UserResolver"
import { AuthResolver } from "resolvers/AuthResolver"
import { BrandResolver } from "resolvers/BrandResolver"
import { ProductResolver } from "resolvers/ProductResolver"
import { WoodResolver } from "resolvers/WoodResolver"
import { ApolloServer } from "@apollo/server"
import { startServerAndCreateNextHandler } from "@as-integrations/next"
import { NextRequest } from "next/server"
import { RequestContext } from "types/RequestContext"
import processRequest from "graphql-upload/processRequest.mjs"
import { ImageResolver } from "resolvers/ImageResolver"
import { SiteResolver } from "resolvers/SiteResolver"

type HandlerType = {
  <HandlerReq extends NextApiRequest>(
    req: HandlerReq,
    res: NextApiResponse
  ): Promise<unknown>
  <HandlerReq_1 extends Request | NextRequest>(
    req: HandlerReq_1,
    res?: undefined
  ): Promise<Response>
}

declare global {
  var graphql: {
    promise: Promise<HandlerType>
    handler: HandlerType
  }
}

let cached = global.graphql

if (!cached) {
  cached = global.graphql = {
    promise: null,
    handler: null,
  }
}

const apolloSingleton = (function () {
  let promise: Promise<HandlerType>
  let handler: HandlerType

  async function initialize(): Promise<HandlerType> {
    let p: string = path.resolve(__dirname, "schema.gql")
    p = p.split(".next")[0] + "lib" + path.sep + "schema.graphqls"

    const schema = await buildSchema({
      resolvers: [
        UserResolver,
        AuthResolver,
        BrandResolver,
        WoodResolver,
        ProductResolver,
        ImageResolver,
        SiteResolver,
      ],
      emitSchemaFile: p,
      globalMiddlewares: [TypegooseMiddleware],
      scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
      validate: true,
    })

    const server = new ApolloServer<RequestContext>({
      schema,
      introspection: true,
    })

    const handlerPromise = startServerAndCreateNextHandler<
      NextRequest,
      RequestContext
    >(server, {
      context: async (req) => {
        // const contentType = req.headers.get("Content-Type")
        // if (contentType.startsWith("multipart/form-data")) {
        // const clonedRequest = req.clone()
        // const formData = await clonedRequest.formData()
        // const formData = await req.formData()
        // console.log(formData)
        // const file = formData.get("file") as File
        // console.log(contentType)
        // console.log(file)
        // const fileToStorage = files[0]
        // }
        return {
          req,
          token: null,
          user: null,
        }
      },
    })

    return handlerPromise
  }

  return async () => {
    const retHandler = handler || cached.handler
    const retPromise = promise || cached.promise
    if (retHandler) {
      return retHandler
    }
    if (retPromise) {
      return await retPromise
    }
    if (!retHandler && !retPromise) {
      cached.promise = promise = initialize()
      handler = cached.handler = await promise
      promise = cached.promise = null
      console.log("✅ Apollo server initialized")
      return handler
    }
  }
})()

export default apolloSingleton
