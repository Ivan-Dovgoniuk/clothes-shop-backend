const {Schema, model} = require('mongoose')


const Cart = new Schema({
    user_id:{type: String,required:true},
    product_id:{type: String},
})

module.exports = model('Carts', Cart)