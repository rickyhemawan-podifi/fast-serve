import mongoose from 'mongoose'
import { Schema } from '../shared/types'
import { DTO } from '../shared/types'

const schema = new mongoose.Schema<Schema.MenuItem>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
})

schema.methods.toDTO = function (): DTO.MenuItem {
  return {
    _id: this._id?.toString() ?? '',
    name: this.name,
    description: this.description,
    price: this.price,
    imageUrl: this.imageUrl,
  }
}

export default mongoose.model<Schema.MenuItem>('MenuItem', schema)
