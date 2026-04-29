const Razorpay = require('razorpay');
const dotenv = require('dotenv');
const express = require("express");
const { protect } = require('../middleware/authMiddleware.js');
const Checkout = require('../models/Checkout.js');
const crypto = require('crypto')

dotenv.config();

const router = express.Router();

var instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });

var options = {
    amount: 50000, // Amount is in currency subunits.
    currency: "INR",
    receipt: "order_rcptid_11"
};


router.post('/create-order', protect, async (req, res) => {

    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;
    options = { ...options, ['amount']: totalPrice * 100 };

    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ message: "no items in checkout" });
    }

    try {
        //  create a new checkout session
        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "Pending",
            isPaid: false,
        });

        const order = await instance.orders.create(options);

        newCheckout.paymentDetails = {orderId: order.id};
        await newCheckout.save();
        // console.log( new);
        res.status(201).json({ newCheckout, order });
    } catch (error) {
        console.error("error creating checkout session:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
});


// @route PUT /api/checkout/:id/pay
// @desc update checkout to mark as paid after successful payment
// @access Private
// router.put("/:id/pay", protect, async(req,res) => {
//     const { paymentStatus, paymentDetails } = req.body;

//     try{
//         const checkout = await Checkout.findById(req.params.id);

//         if(!checkout){
//             return res.status(404).json({message: "Checkout not found"});
//         }

//         if(paymentStatus === "paid"){
//             checkout.isPaid = true,
//             checkout.paymentStatus = paymentStatus;
//             checkout.paymentDetails = paymentDetails;
//             checkout.paidAt = Date.now();
//             await checkout.save();

//             res.status(200).json(checkout);
//         }else{
//             res.status(400).json({ message: "Invalid payment status"});
//         }
//     }catch(error){
//         console.error(error.message);
//         res.status(500).json({ message: "Server error"});
//     }
// });


// @route POST /api/checkout/:id/finalize
// @desc finalize checkout and convert to an order after payment confirmation
// @access Private
router.post("/success", protect, async (req, res) => {
    try {
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            documentId
        } = req.body;

        const checkout = await Checkout.findById(documentId);

        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" });
        }

        // creating our own digest
        // the format should be like this:
        // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);

        const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");

        // comparing our digest with the actual signature
        if (digest !== razorpaySignature) {
            return res.status(400).json({ message: "Transaction is not legit!" });
        }

        // THE PAYMENT IS LEGIT & VERIFIED
        // you can save the details in your database if you want
        checkout.isPaid = true;
        checkout.paymentStatus = "Success";
        checkout.paymentDetails = {
            orderId: orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        };
        checkout.paidAt = Date.now();
        await checkout.save();

        res.json({ message: "received your request for success payment", orderId: razorpayOrderId, paymentId: razorpayPaymentId, });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/:id/cancelled", protect, async(req,res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);

        checkout.paymentStatus = 'Cancelled';
        await checkout.save();

        res.status(200).json({message: "cancelled the order successfully"});

    } catch (error) {
      console.error(error.message); 
      res.status(500).json({message: "failed to cancelled the payment"});  
    }
});

router.put("/:id/failed", protect, async(req,res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);

        checkout.paymentStatus = 'Failed';
        await checkout.save();

        res.status(200).json({message: "cancelled the order successfully"});

    } catch (error) {
      console.error(error.message); 
      res.status(500).json({message: "failed to cancelled the payment"});  
    }
});

module.exports = router;