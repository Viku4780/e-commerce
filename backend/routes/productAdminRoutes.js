const express = require("express");
const Product = require("../models/Product.js");
const {protect, admin} = require("../middleware/authMiddleware.js");

const router = express.Router();

// @route GET /api/admin/products
// @desc get all products (admin only)
// @access Private/Admin
router.get("/",protect, admin, async(req,res) => {
    try {
        const products = await Product.find({});
        // console.log(products);
        res.json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "server error"});
    }
});


module.exports = router;