import express from 'express';
import { addReview, getAllReviews} from "../controllers/reviewController.js"; // Import các controller cho review
import authUser from '../middleware/auth.js'; // Middleware xác thực người dùng

const reviewRouter = express.Router(); // Tạo router cho review

// Route để thêm bình luận cho sản phẩm
reviewRouter.post('/:orderId/add', addReview); // Thêm bình luận vào sản phẩm

// Route mới không cần productId
reviewRouter.get('/get', getAllReviews);



export default reviewRouter;