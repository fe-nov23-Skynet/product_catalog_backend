import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  id: { type: String, required: true },
  namespaceId: { type: String, required: true },
  name: { type: String, required: true },
  capacityAvailable: { type: [String], required: true },
  capacity: { type: String, required: false },
  currentCategory: { type: mongoose.Types.ObjectId, ref: 'Category', required: false },
  priceRegular: { type: Number, required: false },
  priceDiscount: { type: Number, required: false },
  colorsAvailable: { type: [String], required: true },
  color: { type: String, required: false },
  images: [{ type: String, required: false }],
  properties: { type: Object, required: false },
  description: [{
    title: { type: String, required: false },
    text: { type: [String], required: false },
  }],
  screen: { type: String, required: false },
  resolution: { type: String, required: false },
  processor: { type: String, required: false },
  ram: { type: String, required: false },
  camera: { type: String, required: false },
  zoom: { type: String, required: false },
  cell: { type: [String], required: true },
  article: { type: String, required: false },
  category: { type: String, required: true },
}, {
  timestamps: true,
});

export const Product = models.Product || model('Product', ProductSchema)
