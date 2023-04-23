import { Schema, model } from "mongoose";

const historySchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    items: [{
        item: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        price: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    totalQty: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    order_date: {
        type: Date,
        required: true
    },
    delivery_date: {
        type: Date,
        required: true
    },
})

export default model('OrderHistory', historySchema);