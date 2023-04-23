import { Schema, model } from "mongoose";

const refreshTokenSchema = new Schema({
    refresh_token: {
        type: String,
        unique: true
    }
});

export default model('RefreshToken', refreshTokenSchema);