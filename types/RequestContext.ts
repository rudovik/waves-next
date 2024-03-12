import { NextRequest } from "next/server"
import { DocumentType } from "@typegoose/typegoose"
import { User } from "models/User"

export interface RequestContext {
  req: NextRequest
  token: string
  user: DocumentType<User>
}
