const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require("./models/Product.js");
const User = require("./models/User.js");
const Cart = require("./models/Cart.js");
const products = require("./data/products.js");

dotenv.config();

// connect to mongoDB
mongoose.connect(process.env.MONGO_URI);

// function to seed data
const seedData = async () => {
    try {
        // clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        // create a default admin user
        const createdUser = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: "123456",
            role: "admin",
        });

        // assign the default user id to each product
        const userID = createdUser._id;

        const sampleProducts = products.map((product) => {
            return {...product, user: userID};
        });

        // insert the products into the database
        await Product.insertMany(sampleProducts);

        console.log("Product data seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("Error seeding the data",error.message);
        process.exit(1);
    }
};

seedData();