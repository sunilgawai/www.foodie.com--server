import { Schema, model } from "mongoose";



const cartSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
})

export default model('Cart', cartSchema);

// cart = {
//     "products": {
//       "643bbb72d9478ae2bdc56937" : 5,
//       "643bb93fdb35403182a6d19b" : 4,
//       "643bb9aadb35403182a6d1a0" : 3,
//       "643bb6799e3ba41bc64940a4" : 2,
//       "643bbb14d9478ae2bdc56934" : 1
//     },
//     "totalQty": 15
//   }