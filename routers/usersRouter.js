const Router = require('express')
const router = new Router()
const usersController = require('../controllers/usersController')
const {check} = require("express-validator")
const authMiddleware = require('../middlewaree/authMiddleware')


router.post('/registration', [
    check('password', "Password must be more than 4 characters").isLength({min:4}),
    check('email',"Email incorrect").isEmail()
], usersController.registration)

router.post('/login', usersController.login)

router.get('/user',authMiddleware,usersController.getUser)

router.post('/addFavoriteProduct',authMiddleware,usersController.addFavoriteProduct)

router.post('/removeFromFavorite',authMiddleware,usersController.removeFromFavorite)

router.get('/getFavorite',authMiddleware,usersController.getFavorite)

router.post('/addToCart',authMiddleware,usersController.addToCart)

router.post('/addFullCart',authMiddleware,usersController.addFullCart)

router.post('/removeFromCart',authMiddleware,usersController.removeFromCart)

router.post('/removeFullCart',authMiddleware,usersController.removeFullCart)

module.exports = router
