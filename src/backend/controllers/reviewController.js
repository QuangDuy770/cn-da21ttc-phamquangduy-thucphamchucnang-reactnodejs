import productModel from "../models/productModel.js"; // Import model sản phẩm

// Thêm bình luận vào sản phẩm
const addComment = async (req, res) => {
    try {
        const { productId, userId, comment, rating, nameuser} = req.body;

        // Kiểm tra xem sản phẩm có tồn tại không
        const product = await productModel.findById(productId);
        if (!product) {
            return res.json({ success: false, message: "Sản phẩm không tồn tại" });
        }

        // Tạo đối tượng bình luận mới
        const newComment = {
            comment,
            rating,
            nameuser,
            user: userId, // userId lấy từ request body
        };

        // Thêm bình luận vào mảng reviews của sản phẩm
        product.reviews.push(newComment);

        // Lưu sản phẩm sau khi đã thêm bình luận
        await product.save();

        res.json({ success: true, message: "Bình luận đã được thêm thành công!" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
// Lấy tất cả bình luận của sản phẩm
const getComments = async (req, res) => {
    try {
        const { productId } = req.body;

        // Kiểm tra xem sản phẩm có tồn tại không
        const product = await productModel.findById(productId).populate('reviews.user', 'name email'); // Populating thông tin người dùng từ user model
        if (!product) {
            return res.json({ success: false, message: "Sản phẩm không tồn tại" });
        }

        // Trả về tất cả các bình luận của sản phẩm
        const comments = product.reviews;

        res.json({ success: true, comments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};



export { addComment,getComments };
