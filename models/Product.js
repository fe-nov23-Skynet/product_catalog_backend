import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: {type: mongoose.Types.ObjectId, ref: 'Category'},
    properties: {type: Object},
    seoTitle: { type: String, required: true },
    seoName: { type: String, required: true }, 
    seoContent: { type: String, required: true }, 
    seoKey: { type: String, required: true }, 
    article: { type: String, required: true },
    characteristics: { type: String, required: true },
    availability: { type: String, required: true },
    dynamicCharacteristics: [{
        key: { type: String, required: true },
        value: { type: String, required: true }
    }],
}, {
    timestamps: true,
});

export const Product = models.Product || model('Product', ProductSchema)
