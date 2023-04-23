import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
    review: {
        type: String,
        required: true
    },
    reviewer: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true });

export default model('Review', reviewSchema);