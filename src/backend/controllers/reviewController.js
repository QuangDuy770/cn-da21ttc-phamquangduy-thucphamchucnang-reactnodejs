import mongoose from 'mongoose';
import orderModel from '../models/orderModel.js'; // Import đúng tên

const addReview = async (req, res) => {
    const { orderId } = req.params;
    const { rating, comment } = req.body;

    // Kiểm tra tính hợp lệ của `orderId`
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: 'orderId không hợp lệ' });
    }

    // Kiểm tra tính hợp lệ của `rating`
    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating phải từ 1 đến 5 sao' });
    }

    try {
        // Tìm đơn hàng theo `orderId`
        const order = await orderModel.findById(orderId); // Sử dụng đúng tên model
        if (!order) {
            return res.status(404).json({ message: 'Order không tồn tại' });
        }

        // Tạo đánh giá mới
        const newReview = {
            rating,
            comment,
            createdAt: new Date(),
        };

        // Thêm đánh giá vào mảng `reviews`
        order.reviews.push(newReview);

        // Lưu thay đổi vào cơ sở dữ liệu
        await order.save();

        res.status(201).json({
            message: 'Thêm đánh giá thành công',
            review: newReview,
        });
    } catch (error) {
        console.error('Error in addReview:', error); // Ghi log lỗi để debug
        res.status(500).json({
            message: 'Lỗi server',
            error: error.message,
        });
    }
};


const getAllReviews = async (req, res) => {
    try {
        // Lấy tất cả đánh giá từ tất cả các đơn hàng
        const allReviews = await orderModel.aggregate([
            { $unwind: "$reviews" },
            {
                $project: {
                    _id: 0,
                    orderId: "$_id", // Thêm orderId
                    items: 1, // Thêm thông tin items
                    firstName: "$address.firstName", // Thêm firstName từ address
                    lastName: "$address.lastName", // Thêm lastName từ address
                    rating: "$reviews.rating",
                    comment: "$reviews.comment",
                    createdAt: "$reviews.createdAt",
                },
            },
        ]);

        res.status(200).json({ success: true, reviews: allReviews });
    } catch (error) {
        console.error("Error in getAllReviews:", error); // Ghi log lỗi để debug
        res.status(500).json({
            message: "Lỗi server",
            error: error.message,
        });
    }
};

export { addReview, getAllReviews};
