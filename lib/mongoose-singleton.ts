import mongoose from "mongoose"
import { Mongoose } from "mongoose"

declare global {
  var mongoose: {
    conn: Mongoose
    promise: Promise<Mongoose>
  }
}

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  )
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

const mongoSingleton = (function () {
  let promise: Promise<Mongoose>
  let conn: Mongoose

  async function initialize() {
    // console.log("Mongoose connection is initializing...")
    const promise = mongoose.connect(MONGODB_URI)
    return promise
  }

  return async () => {
    const retConn = conn || cached.conn
    const retPromise = promise || cached.promise
    if (retConn) {
      return retConn
    }
    if (retPromise) {
      return await retPromise
    }
    if (!retConn && !retPromise) {
      cached.promise = promise = initialize()
      cached.conn = conn = await promise
      promise = cached.promise = null
      console.log("✅ Mongoose connected to DB")
      return conn
    }
  }
})()

export default mongoSingleton
