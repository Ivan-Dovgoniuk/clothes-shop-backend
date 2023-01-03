const {Schema, model} = require('mongoose')


const Product = new Schema({
    name: {type: String,required: true},
    thumbnail:{type: String,required: true},
    price:{type:Number,required: true},
    color:{type: String,required: true},
    short_description:{type: String},
    full_description:{type: String},
    size:{type:String,required: true},
    category:{type: String,required: true},
    gender:{type:String,required: true},
    sale:{type:Boolean},
    new_price:{type:Number},
    isNewProduct:{type:Boolean}

},{ timestamps: true })

module.exports = model('Products', Product)