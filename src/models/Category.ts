import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    icon: {
        type: String, // It will be an image.
        required: true
    }
}, { timestamps: true });

export default model('Category', categorySchema);