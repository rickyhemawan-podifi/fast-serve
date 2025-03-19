import mongoose from 'mongoose'
import { Schema } from '../shared/types'
import Model from './index'
const schema = new mongoose.Schema<Schema.Order>({
  orderItems: { type: [String], required: true },
})

// cascade delete orderItems
schema.pre('deleteOne', async function (next) {
  const doc = await this.model.findOne(this.getQuery())
  if (doc) {
    await Model.OrderItem.deleteMany({ _id: { $in: doc.orderItems } })
  }
  next()
})

export default mongoose.model<Schema.Order>('Order', schema)
