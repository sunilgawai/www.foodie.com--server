import { Schema, model } from "mongoose";
import { APP_PORT } from "../../config";

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
        required: false,
        get: (image: string) => {
            // Needs to ass Hosting URL in production.
            return `${'http://localhost:'}${APP_PORT}/${image}`;
        }
    }
}, { timestamps: true, toJSON: {getters: true}, id: false});

export default model('Category', categorySchema);