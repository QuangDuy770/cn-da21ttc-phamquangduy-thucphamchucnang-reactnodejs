import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // ID người dùng đã tạo đơn hàng
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    soLuong: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: 'Sẵn sàng giao hàng' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number, required: true },
    revenue: { type: Number, default: 0 },
    reviews: [
        {
            rating: { type: Number, required: true, min: 1, max: 5 }, // Số sao (1-5)
            comment: { type: String, required: false }, // Bình luận (không bắt buộc)
            createdAt: { type: Date, default: Date.now } // Thời gian tạo đánh giá
        }
    ]
});

const orderModel = mongoose.model.order || mongoose.model('order', orderSchema);
export default orderModel;
