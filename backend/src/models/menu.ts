import mongoose from 'mongoose'
import { EnumMenuTypes, Schema } from '../shared/types'
const schema = new mongoose.Schema<Schema.Menu>({
  startTime: { type: Number, required: true },
  endTime: { type: Number, required: true },
  menuItems: { type: [String], required: true },
  type: { type: String, enum: EnumMenuTypes, required: true },
})

export default mongoose.model<Schema.Menu>('Menu', schema)
