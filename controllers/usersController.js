const User = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const FavoriteProduct = require('../models/FavoriteProducts');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Products = require('../models/Product')



const generateAccessToken = (id) => {
    const secret = process.env.JWT_ACCESS_SECRET
    const payload = {
        id
    }
    return jwt.sign(payload, secret, {expiresIn: "7d"})
}

class usersController {

    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Registration error", errors})
            }
            const {password,email} = req.body;
            const newUserEmail = await User.findOne({email})
            if (newUserEmail) {
                return res.status(400).json({message: "This email alredy registered"})
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const user = new User({password:hashPassword,email,role:'user'})
            await user.save()
            const token = generateAccessToken(user._id)
            return res.json({token,message: "User successfully registered"})
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: 'Registration error'})
        }
    }

    async login(req, res) {
        try {
            const {email, password} = req.body
            const user = await User.findOne({email})
            if (!user) {
                return res.status(400).json({message: `Password or email incorect`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: `Password or email incorect`})
            }
            const token = generateAccessToken(user._id)
            return res.json({token})
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: 'Login error'})
        }
    }

    async getUser(req, res) {
        const userID = req.userData.id
        try {
            const user = await User.findOne({user_id:userID})
            const {email,role} = user;
            let favoriteProducts = await FavoriteProduct.find({user_id:userID})
            favoriteProducts = favoriteProducts.map(item=>{
                return item.product_id
            })
            let cart = await Cart.find({user_id:userID})
            cart = cart.map((item)=>{
                return item.product_id
            })
            return res.json({role,favoriteProducts,cart})
        } catch (e) {
            console.log(e)
        }
    }

    async addFavoriteProduct(req, res) {
        const userID = req.userData.id
        const productID = req.body.product_id
        try {
            const favoriteProduct = new FavoriteProduct({user_id:userID,product_id:productID})
            await favoriteProduct.save()
            return res.json({message:"Added to favorite"})
        } catch (e) {
            console.log(e)
        }
    }
    async removeFromFavorite(req, res) {
        const userID = req.userData.id
        const productID = req.body.product_id
        try {
            await FavoriteProduct.deleteOne({user_id:userID,product_id:productID})
            return res.json({message:'Deleted successfully'})
        } catch (e) {
            console.log(e)
        }
    }

    async getFavorite(req,res) {
        const userID = req.userData.id
        let productsID = req.query.products_id

        if(productsID && productsID !== 'undefined'){
            productsID = productsID.split(',')
        }else return

        try{
            const products = productsID.map( async (id)=>{
                const product= await Products.findById(id)
                return product
            })
            console.log(products)
        }catch(e){
            console.log(e)
        }
    }

    async addToCart(req, res) {
        const userID = req.userData.id
        const productID = req.body.product_id
        try {
            const cart = new Cart({user_id:userID,product_id:productID})
            await cart.save()
            return res.json({cart})
        } catch (e) {
            console.log(e)
        }
    }

    async removeFromCart(req, res) {
        const userID = req.userData.id
        const productID = req.body.product_id
        try {
            await Cart.deleteOne({user_id:userID,product_id:productID})
            return res.json({message:'Deleted successfully'})
        } catch (e) {
            console.log(e)
        }
    }

    async removeFullCart(req, res) {
        const userID = req.userData.id
        try {
            await Cart.deleteMany({user_id:userID})
            return res.json({message:'Deleted successfully'})
        } catch (e) {
            console.log(e)
        }
    }

    async addFullCart(req, res) {
        const userID = req.userData.id
        const productsID = req.body.products_id
        await Cart.deleteMany({user_id:userID})
        try {
            productsID.forEach(async (item)=>{
                const cart = new Cart({user_id:userID,product_id:item})
                await cart.save()
            })
            return res.json({message:'Cart created successfully'})
        } catch (e) {
            console.log(e)
        }
    }

    async getOrders(req, res) {
        const userID = req.userData.id
        try {
            const orders = await Order.find({user_id:userID})
            let ordersList = []
            for(let i = 0;i<orders.length;i++){
                const orderID = orders[i]._id
                const orderItems = await OrderItem.find({order_id:orderID})
                ordersList.push(orderItems)
            }
            return res.json({ordersList})
        } catch (e) {
            console.log(e)
        }
    }

    async addOrder(req, res) {
        const userID = req.userData.id
        const orderItems = req.body.orderItems
        try {
            const order = new Order({user_id:userID})
            await order.save()
            const orderID = order._id
            for(let i = 0;i<orderItems.length;i++){
                const number = orderItems[i].number
                const product_id = orderItems[i].product_id
                const price = orderItems[i].price
                const orderItem = new OrderItem({number,product_id,price,order_id:orderID})
                await orderItem.save()
            }



            return res.json({message: "Order successfully created"})

        } catch (e) {
            console.log(e)
        }
    }



} 



module.exports = new usersController()
