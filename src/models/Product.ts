import { Schema, model } from "mongoose";
import { APP_PORT, APP_URL } from "../../config";

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    // image: {
    //     type: String,
    //     required: true,
    //     get: (image: string) => {
    //         // Needs to pass Hosting URL in production.
    //         return `${'http://localhost:'}${APP_PORT}${image}`;
    //     }
    // },
    images: [{
        type: String,
        required: true,
        get: (image: string) => {
            // Needs to pass Hosting URL in production.
            return `${APP_URL}/${image}`;
        }
    }],
    isFeatured: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: false,
        default: true
    },
    category: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    countInStock: {
        type: Number,
        min: 0,
        max: 255,
        required: true
    },
    ratings: {
        type: Number,
        required: true
    },
    discount: {
        type: String,
        required: false,
        default: "10%"
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
        required: false
    }]
}, { timestamps: true, toJSON: { getters: true }, id: false })

export default model('Product', productSchema);