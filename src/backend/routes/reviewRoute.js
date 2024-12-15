import express from 'express';
import { addComment, getComments } from "../controllers/reviewController.js"; // Import các controller cho review
import authUser from '../middleware/auth.js'; // Middleware xác thực người dùng

const reviewRouter = express.Router(); // Tạo router cho review

// Route để thêm bình luận cho sản phẩm
reviewRouter.post('/add', authUser, addComment); // Thêm bình luận vào sản phẩm

// Route để lấy tất cả bình luận của một sản phẩm
reviewRouter.get('/get', authUser, getComments); // Lấy các bình luận của sản phẩm

export default reviewRouter;