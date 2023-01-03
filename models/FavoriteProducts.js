const {Schema, model} = require('mongoose')


const FavoriteProduct = new Schema({
    user_id: {type: String,required: true},
    product_id:{type: String,required:true},

})

module.exports = model('FavoriteProducts', FavoriteProduct)