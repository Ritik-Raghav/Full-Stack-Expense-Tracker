const Razorpay = require('razorpay');
const Order = require('../models/order');

exports.purchasePremium = async (req, res, next) => {
    try {
        const user = req.user;
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;

        await rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            user.createOrder( { orderid: order.id, status: 'PENDING'})
                .then(() => {
                    return res.status(201).json({ order, key_id: rzp.key_id});
                })
                .catch((error) => {
                    throw new Error(error);
                })
        })
    }
    catch(error) {
        console.log(error);
        res.status(403).json({ message: 'Something went wrong', error});
    }
}

exports.updateTransactionStatus = async (req, res, next) => {
    try {
        const { payment_id, order_id} = req.body;
        const order = await Order.findOne({ where: {orderid: order_id}});
        if (!order) {
            return res.status(404).json({ message: 'Order not found!'})
        }

        // Update order status and payment id
        const promise_1 = order.update({ paymentid: payment_id, status: 'SUCCESSFUL'});

        // Update user to premium
        const user = req.user;
        const promise_2 =  user.update({ isPremiumUser: true});

        Promise.all([promise_1, promise_2])
            .then(() => {
                return res.status(202).json({ success: true, message: 'Transaction Successful'});
            })
            .catch((error) => {
                throw new Error(error);
            })
    }
    catch(error) {
        
        console.log('Error in updateTransactionStatus:', error);
        res.status(500).json({ message: 'Transaction update failed', error});
    }
}

exports.markTransactionFailed = async (req, res, next) => {
    try {
        const { order_id } = req.body;

        // Find the order by order_id
        const order = await Order.findOne({ where: { orderid: order_id } });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the order status to FAILED
        await order.update({ status: 'FAILED' });
        return res.status(200).json({ success: true, message: 'Order status updated to FAILED' });
    } catch (error) {
        console.error('Error in markTransactionFailed:', error);
        res.status(500).json({ message: 'Failed to update transaction status', error });
    }
};
