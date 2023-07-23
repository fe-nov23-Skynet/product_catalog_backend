const { Schema, model, models } = require("mongoose");

const OrderSchema = new Schema({
    line_items: Object,
    name: String,
    surname: String,
    middlename: String, 
    number: String,
    city: String,
    post: String,
    email: String,
    paid: Boolean,
}, {
    timestamps: true,
});

export const Order =   models?.Order || model("Order", OrderSchema)