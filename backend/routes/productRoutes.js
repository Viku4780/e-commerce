const express = require("express");
const Product = require("../models/Product.js");
const {protect, admin} = require("../middleware/authMiddleware.js");

const router = express.Router();

// @route POST /api/products
// @desc Create a new product
// @access Private/Admin
router.post("/", protect,admin, async(req,res) => {
    console.log('working product api');
    try {
        const {name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections, material, gender, images, isFeatured, isPublished, tags, dimensions, weight, sku} = req.body;

        const product = new Product({
            name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections, material, gender, images, isFeatured, isPublished, tags, dimensions, weight, sku, user : req.user._id, // reference to the admin user who created it
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server error");
    }
});

// @route PUT /api/products/:id
// @desc update an existing product ID
// @access Private/Admin
router.put("/:id", protect, admin, async(req,res) => {
    try {
         const {name, description, price, discountPrice, countInStock, category, brand, sizes, colors, collections, material, gender, images, isFeatured, isPublished, tags, dimensions, weight, sku} = req.body;

         // find the product by ID
         const product = await Product.findById(req.params.id);

         if(product){
            // Update product fields
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.brand = brand || product.brand;
            product.sizes = sizes || product.sizes;
            product.color = colors || product.color;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender = gender || product.gender;
            product.images = images || product.images;
            product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;
            product.sku = sku || product.sku;

            // console.log('product working')

            // save the updated product
            const updatedProduct = await product.save();
            // console.log(updatedProduct);
            res.json(updatedProduct);
         }else{
            res.status(404).json({ message: "Product not found" });
         }
    } catch (error) {
        console.error(error);
        res.status(500).send("server error")
    }
});

// @route Delete /api/product/:id
// @desc delete a product by ID
// @access private/admin
router.delete("/:id", protect, admin, async(req,res) => {
    try {
        console.log('delete api started');
        // find the product by ID
        const product = await Product.findById(req.params.id);

        console.log(product);

        if(product){
            // remove the product from db
            await product.deleteOne();
            res.json({ message: "Product removed"});
        }else {
            res.status(404).json({ message: "Product not found"});
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server error");
    }
});

// @route GET /api/products
// @desc Get all products with optional query filters
// @access Public
router.get("/", async(req, res) => {
    try {
        const {collection, size , color, gender, minPrice, maxPrice, sortBy, search,material, category, brand, limit} = req.query;

        let query = {};

        // console.log('1 test');

        // filter logic
        if(collection && collection.toLocaleLowerCase() !== "all"){
            query.collections = collection;
        }

        if(category && category.toLocaleLowerCase() !== 'all'){
            query.category = category;
        }

        if(material){
            query.material = { $in: material.split(",")};
        }

        if(brand){
            query.brand = { $in: brand.split(",")};
        }

        if(size){
            query.sizes = { $in: size.split(",")};
        }

        if(color){
            query.colors = { $in: [color] };
        }

        if(gender){
            query.gender = gender;
        }

        if(minPrice || maxPrice){
            query.price = {};

            if(minPrice) query.price.$gte = Number(minPrice);

            if(maxPrice) query.price.$lte = Number(maxPrice);
        }

        if(search){
            query.$or = [
                {name: {$regex:  search, $options: "i"}},
                {description: {$regex:  search, $options: "i"}},
            ]
        }

        //  console.log('2 test');

        // Sort Logic
        let sort = {};

        if(sortBy){
            switch (sortBy){
                case "priceAsc":
                    sort = {price: 1};
                    break;
                case "priceDesc": 
                    sort = {price: -1};
                    break;
                case "popularity":
                    sort = {rating: -1};
                    break;
                default: 
                break;
            }
        }

        //  console.log('3 test');

        // fetch products and apply sorting and limit
        let products = await Product.find(query).sort(sort).limit(Number(limit) || 0);

        //  console.log('4 test');

        res.status(200).json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }
});


// @route GET /api/products/best-seller
// @desc Retrieve the product with highest rating
// @access Public
router.get("/best-seller", async(req,res) => {
    try {
        // res.send("this should work");
        const bestSeller = await Product.findOne().sort({rating: -1});
        if(bestSeller){
            res.json(bestSeller);
        }else{
            res.status(404).json({message: "No best seller found"});
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }
});

// @route GET /api/products/new-arrivals
// @desc Retrieve latest 8 products - Creation date
// @access public
router.get("/new-arrivals", async(req,res) => {
    try {
        // fetch latest 8 products
        const newArrivals = await Product.find().sort({created: -1}).limit(8);
        res.json(newArrivals);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error");
    }
});


// @route GET /api/products/:id
// @desc Get a single product by ID
// @access Public
router.get("/:id", async(req,res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            res.json(product);
        }else{
            res.status(404).json({message: "Product not found"});
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("intenal server error");
    }
});

// @route GET /api/products/similar/:id
// @desc retrieve similar products based on the current products gender and category
// @access public
router.get("/similar/:id", async (req,res) => {
    const {id} = req.params;
    // console.log('working fine');
    // res.status(200).json({message: 'working fine'});

    try {
        const product = await Product.findById(id);

        if(!product){
            return res.status(404).json({message: "cannot found product"});
        }

        const similarProducts = await Product.find({
            _id: {$ne: id}, // exclude the current product ID
            gender: product.gender,
            category: product.category,
        }).limit(4);

        res.json(similarProducts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

/*
// @route GET /api/products/best-seller
// @desc Retrieve the product with highest rating
// @access Public
router.get("/best-seller", async(req,res) => {
    try {
        res.send("this should not work")
    } catch (error) {
        
    }
})
    */

module.exports = router;