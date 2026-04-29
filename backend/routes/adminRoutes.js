const express = require('express');
const User = require("../models/User.js");
const {protect, admin} = require("../middleware/authMiddleware.js");

const router = express.Router();


// @route GET /api/admin/users
// @desc Get all users (admin only)
// @access Private/Admin
router.get("/", protect, admin, async(req,res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "server error"});
    }
});


// @route POST /api/admin/users
// @desc add a new user (admin only)
// @access Private/Admin
router.post("/", protect, admin, async(req,res) => {
  const {name, email, password, role} = req.body;

  try {
    let user = await User.findOne({ email });
    if(user){
        return res.status(400).json({message: "User already exists"});
    }

    user = new User({
        name,
        email,
        password,
        role: role || "customer",
    });

    await user.save();

    res.status(201).json({message: "user created successfully", user});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
 });


 // @route PUT /api/admin/users/:id
 // @desc update user info (admin only) - name , email and role
 // @access Private/Admin
 router.put("/:id", protect, admin, async(req,res) => {
    // console.log('running admin update');
    try {
        const user = await User.findById(req.params.id);
        // console.log(user);
        if(user){
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
        }

        
        const updatedUser  = await user.save();
        // console.log(updatedUser);

        res.json({messege: "User updated successfully", user: updatedUser});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server error");
    }
 });


 // @route DELETE /api/admin/users/:id
 // @desc delete the user
 // @access Private/Admin
 router.delete("/:id", protect, admin, async(req,res) => {
    try {
        const user = await User.findById(req.params.id);
        if(user){
            await user.deleteOne();
            res.json({ message: "User deleted successfully"});
        }else{
            res.status(404).json({message: "user not found"});
        }
    } catch (error) {
       console.error(error.message);
       res.status(500).json({message: "server error"}); 
    }
 });


module.exports = router;