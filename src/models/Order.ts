import { Schema, model } from "mongoose";
// import { IOder } from "../@types";

const orderSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    items: [{
        type: Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true
    }],
    status: {
        type: String,
        enum: ["Order_Placed",
            "Order_Recieved",
            "Order_Created",
            "Ready_To_Deliver",
            "Order_Sent_For_Delivery",
            "Order_Arriving_For_Delivery",
            "Order_Delivered",
            "Order_Cancelled"
        ],
        required: true
    },
    payment_type: {
        type: String,
        enum: ["COD", "UPI"],
        required: true
    },
    payment_done: {
        type: Boolean,
        required: true
    },
    total_price: {
        type: Number,
        required: true
    },
    shipping_address: {
        type: Schema.Types.ObjectId,
        required: true
    },
    message: {
        type: String,
        required: false
    },
    order_date: {
        type: Date,
        required: false,
        default: Date.now
    },
    expected_delivery_date: {
        type: Date,
        required: false,
        default: Date.now
    },
    delivery_date: {
        type: Date,
        required: false,
        default: Date.now
    }
}, { timestamps: true })

export default model('Order', orderSchema);