const {Schema, model} = require('mongoose')


const OrderItem = new Schema({
    order_id:{type: String,unique:true,required:true},
    product_id:{type: String,required:true},
    number:{type:String,required:true},
    price:{type:Number,required:true}

})

module.exports = model('OrderItems', OrderItem)