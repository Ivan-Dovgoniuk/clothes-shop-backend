const {Schema, model} = require('mongoose')

const ProductImg = new Schema({
    product_id:{type: String,required:true,unique:true},
    image_1:{type: String,unique:true},
    image_2:{type: String,unique:true},
    image_3:{type: String,unique:true},
    image_4:{type: String,unique:true},
    image_5:{type: String,unique:true}
})

module.exports = model('ProductsImages',ProductImg)