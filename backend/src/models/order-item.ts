import mongoose from 'mongoose'
import { Schema } from '../shared/types'
import Model from './index'
const schema = new mongoose.Schema<Schema.OrderItem>({
  menuItemId: { type: String, required: true },
  quantity: { type: Number, required: true },
})

// remove reference to orderItem from order
schema.pre('deleteOne', async function (next) {
  const doc = await this.model.findOne(this.getQuery())
  if (doc) {
    await Model.Order.updateMany(
      { orderItems: { $in: [doc._id] } },
      { $pull: { orderItems: doc._id } },
    )
  }
  next()
})
export default mongoose.model<Schema.OrderItem>('OrderItem', schema)
