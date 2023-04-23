import { Schema, model } from "mongoose";
// import Cart from "./Cart";

const userSchema = new Schema({
    avatar: {
        type: String,
        required: false,
        default: 'https:www.github.com/sunilgawai'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: [{
        type: Schema.Types.ObjectId,
        ref: 'Address',
        required: false
    }],
    role: {
        type: String,
        required: false,
        default: "CUSTOMER"
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart',
        required: false
    },
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order',
        requied: false
    }],
    wishlist: [{
        type: Schema.Types.ObjectId,
        required: false
    }]
}, { timestamps: true });

export default model('User', userSchema);