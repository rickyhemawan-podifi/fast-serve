import mongoose from 'mongoose'

const {
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_INITDB_DATABASE,
} = process.env
export const MONGO_URI = `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/${MONGO_INITDB_DATABASE}?authSource=admin`

export const connect = async () => {
  mongoose.Promise = global.Promise
  await mongoose.connect(MONGO_URI)
}

export const disconnect = async () => {
  await mongoose.disconnect()
}
