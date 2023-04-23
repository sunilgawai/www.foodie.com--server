import { Schema, model, trusted } from "mongoose";

const addressSchema = new Schema({
    address_type: {
        type: String,
        required: true,
        enum: ['HOME', 'OFFICE', 'OTHER']
    },
    country: {
        type: String,
        required: true
    },
    state_province_region: {
        type: String,
        required: true
    },
    city_town: {
        type: String,
        required: true
    },
    zip_postal_code: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
        required: true
    },
    secondary_contact: {
        type: Number,
        required: true
    },
    latitude: {
        type: String,
        required: false
    },
    longitude: {
        type: String,
        required: false
    },
}, { timestamps: true });

export default model('Address', addressSchema);