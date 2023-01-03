const {Schema, model} = require('mongoose')


const Order = new Schema({
    user_id:{type: String,unique:true,required:true},
},{ timestamps: true })

module.exports = model('Orders', Order)