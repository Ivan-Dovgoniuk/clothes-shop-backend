const Products = require('../models/Product')
const ProductsImages = require('../models/Product_Img')


class productsController {

    async getProducts(req, res) {
        const pageOptions = {
            page: parseInt(req.query.page, 10) || 1,
            limit: parseInt(req.query.limit, 10) || 9,
        }
        let category = req.query.category
        let gender = req.query.gender
        let color = req.query.color
        let size = req.query.size
        let price = req.query.price
        let isNewProduct = req.query.isNewProduct
        let sale = req.query.sale
        let searchField = req.query.searchField

        if(searchField == 'undefined' || !searchField){
            searchField = undefined
        }

        if(color == 'undefined' || !color){
            color = undefined
        }

        if(category == 'undefined' || !category){
            category = undefined
        }

        if(gender == 'undefined' || !gender){
            gender = undefined
        }

        if(size == 'undefined' || !size){
            size = undefined
        }else size = req.query.size.split(',')

        if(price == 'undefined' || !price){
            price = undefined
        }else price = req.query.price.split(',')

        if(isNewProduct == 'true'){
            isNewProduct = true
        }else isNewProduct = false

        if(sale =='true'){
            sale = true
        }else sale = false
        
        try {
            let searchProducts = await Products.find({})
            if(gender){
                searchProducts = searchProducts.filter(item=>{
                    return item.gender == gender
                })
            }
            if(category){
                searchProducts = searchProducts.filter(item=>{
                    return item.category == category
                })
            }
            if(color){
                searchProducts = searchProducts.filter(item=>{
                    return item.color == color
                })
            }

            if(size){
                if(size.length == 1)
                searchProducts = searchProducts.filter(item=>{
                    return item.size == size[0]
                })
                else{
                        let filteredByColor = [];
                    for(let i = 0;i<=size.length-1;){
                        let filter = searchProducts.filter(item=>{
                            return item.size == size[i]
                        })
                        if(filter.length>0){
                            filteredByColor=filteredByColor.concat(filter)
                        }
                        i++
                    }
                    searchProducts = filteredByColor.slice()
                }
            }
            if(price){
                searchProducts = searchProducts.filter(item=>{
                    return item.price>= +price[0] && item.price<= +price[1]
                })
            }
            if (sale){
                searchProducts = searchProducts.filter(item=>{
                    return item.sale == sale
                })
            }

            if (searchField){
                 searchProducts = searchProducts.filter(({name,short_description,full_description})=>{
                    return name.toLowerCase().indexOf(searchField.toLowerCase()) !== -1 || 
                           short_description.toLowerCase().indexOf(searchField.toLowerCase()) !== -1 || 
                           full_description.toLowerCase().indexOf(searchField.toLowerCase()) !== -1
                })
            }
            searchProducts.forEach(async item=>{
                if(Date.now() - new Date(item.createdAt) < 432000000){
                    const update = { isNewProduct: true };
                    await item.updateOne(update)
                }else {
                    const update = { isNewProduct: false };
                    await item.updateOne(update)
                }
            })
            if (isNewProduct){
                searchProducts = searchProducts.filter(item=>{
                    return item.isNewProduct == isNewProduct
                })
            }

            let ProductsOnPage = searchProducts
                .slice((pageOptions.page-1)*pageOptions.limit,pageOptions.limit*pageOptions.page)
            return res.json({ProductsOnPage,number:searchProducts.length})
        } catch (e) {
            console.log(e)
        }
    }

    async getProduct(req, res) {
        const productID = req.params.id
        try {

        let Product = await Products.findById(productID);

        if (Date.now() - new Date(Product.createdAt) < 432000000){
            const update = { isNewProduct: true };
            await Product.updateOne(update)
            Product = await Products.findById(productID);
        }
        const Images = await ProductsImages.findOne({product_id:productID});
        return res.json({Product,Images})
        }
        catch (e) {
            console.log(e)
        }
    }

    async addProduct(req, res) {
        const {name,price,short_description,full_description,color,category,sale,new_price,size,gender} = req.body;
        const images = req.files.img
        const isNewProduct = true;
        const imagesUrl =images.map(image =>{
            return (
                `http://localhost:5000/${image.filename}`
            )
        });

        try {   
            const newProduct = await new Products({name,price,short_description,full_description,color,category,sale,new_price,size,gender,thumbnail:imagesUrl[0],isNewProduct})
            await newProduct.save()
            const newProductID = newProduct._id

            const newProductImages = await new ProductsImages({
                product_id:newProductID,
                image_1:imagesUrl[0],
                image_2:imagesUrl[1],
                image_3:imagesUrl[2],
                image_4:imagesUrl[3],
                image_5:imagesUrl[4]
            })
            await newProductImages.save()

            return res.json({message: "Added successfully"})
        } catch (e) {
            console.log(e)
        }
    }
    async getProductBySearchField(req, res) {
        const searchField = req.query.searchField
        try {
        if(searchField && searchField.length > 2){
            let allProducts = await Products.find({});
            let searchProducts = allProducts.filter(({name,short_description,full_description})=>{
                return name.toLowerCase().indexOf(searchField.toLowerCase()) !== -1 || 
                       short_description.toLowerCase().indexOf(searchField.toLowerCase()) !== -1 || 
                       full_description.toLowerCase().indexOf(searchField.toLowerCase()) !== -1
            })
            searchProducts = searchProducts.map (({name,_id})=>{
                return {name,_id}
            })
            return res.json(searchProducts)
        }
        }
        catch (e) {
            console.log(e)
        }
    }
} 

module.exports = new productsController()
