
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'

//Global variable
const currency = 'vnd'
const deliveryCharge = 5000

//gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// COD Method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            amount,
            address,
            soLuong: items.reduce((total, item) => total + item.quantity, 0),
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Cập nhật số lượng sản phẩm
        for (const item of items) {
            await productModel.findByIdAndUpdate(item._id, {
                $inc: { soLuong: -item.quantity }
            });
        }

        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Stripe Method
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 1
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Phí giao hàng'
                },
                unit_amount: deliveryCharge * 1
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        });

        // Cập nhật số lượng sản phẩm
        for (const item of items) {
            await productModel.findByIdAndUpdate(item._id, {
                $inc: { soLuong: -item.quantity }
            });
        }

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// All orders data from Admin Panel 
const allOrders = async (req,res) => {

    try {

        const orders = await orderModel.find({})
        res.json({success:true, orders})

    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message})
    }

}

// User order data for frontend
const userOrders = async (req,res) => {

    try {
        
        const {userId} = req.body

        const orders = await orderModel.find({userId})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message})
    }


}

// Update order status from Admin Panel
const updateStatus = async (req,res) => {

    try {
        
        const {orderId,status} = req.body

        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({success: true, message: 'Đã cập nhật trạng thái đơn hàng'})
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message})
    }
}

const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({ success: true });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {verifyStripe, placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus}
