const Router = require('express')
const router = new Router()
const productsController = require('../controllers/productsController')
const { upload } = require('../multer')


router.get('/getProducts', productsController.getProducts);
router.get('/getProduct/:id', productsController.getProduct);
router.post('/addProduct',upload.fields([{name:'img',maxCount:5}]),productsController.addProduct)
router.get('/getProductBySearchField',productsController.getProductBySearchField)
module.exports = router
