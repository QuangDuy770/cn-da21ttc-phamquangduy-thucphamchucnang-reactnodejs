import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    comment: { type: String, required: true }, // Bình luận của người dùng
    rating: { type: Number, required: true, min: 1, max: 5 }, // Số sao từ 1 đến 5
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, // Tham chiếu đến userModel
    nameuser: { type: String, required: true },
    date: { type: Date, default: Date.now } // Ngày bình luận
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    soLuong: { type: Number, required: true },
    thanhPhan: { type: String, required: true },
    bestseller: { type: Boolean },
    date: { type: Number, required: true },
    reviews: [reviewSchema] // Mảng các đánh giá
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
