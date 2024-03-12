import dbConnect from "lib/mongoose-singleton"
import initServer from "lib/apollo-singleton"
import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import mime from "mime"
import { getClient } from "lib/apollo-client"
import { AuthDocument } from "lib/graphql/Auth.graphql"
import { getAuthCookie } from "lib/getAuthCookie"

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

async function handler(req: NextRequest) {
  await dbConnect()
  const _handler = await initServer()

  const requestContentType = req.headers.get("content-type")
  if (
    requestContentType &&
    requestContentType.startsWith("multipart/form-data")
  ) {
    const client = getClient()
    const authCookie = getAuthCookie()

    const {
      data: { auth: user },
    } = await client.query({
      query: AuthDocument,
      errorPolicy: "ignore",
      context: {
        headers: authCookie
          ? {
              cookie: "w_auth=" + authCookie,
            }
          : {},
      },
    })

    // console.log(user)

    if (!(user.isAdmin && user.isAuth)) {
      return NextResponse.json({ success: false })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const buffer = await file.arrayBuffer()
    const ext = file.name.split(".").pop()
    const b64 = Buffer.from(buffer).toString("base64")
    const type = mime.getType(ext)
    let dataURI = "data:" + type + ";base64," + b64

    const { url, public_id } = await cloudinary.uploader.upload(dataURI, {
      public_id: `${Date.now()}`,
      resource_type: "auto",
    })

    // const json = data.json()
    // console.log(json)

    return NextResponse.json({ url, public_id, success: true })
  }

  const response = await _handler(req)
  const contentType = response.headers.get("Content-Type")
  if (contentType === "application/json; charset=utf-8") {
    const json = await response.json()

    const rsp = NextResponse.json(json, { status: response.status })
    if ("errors" in json) return rsp
    if ("login" in json.data) {
      rsp.cookies.set("w_auth", json.data.login.user.token)
      return rsp
    } else if ("logout" in json.data) {
      rsp.cookies.delete("w_auth")
      return rsp
    }

    return rsp
  }
  return response
}

export { handler as GET, handler as POST }
