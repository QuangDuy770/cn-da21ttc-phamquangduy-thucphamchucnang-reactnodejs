import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, addToWish, token } =
    useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [userName, setUserName] = useState(""); // State lưu tên người dùng
  const [activeTab, setActiveTab] = useState("info");
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0); // State để lưu số sao trung bình
  const [reviewCount, setReviewCount] = useState(0); // State để lưu tổng số đánh giá
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch dữ liệu sản phẩm
  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image);
        setReviews(item.reviews || []);
        calculateRatingStats(item.reviews || []);
        return null;
      }
    });
  };

  // Tính toán số sao trung bình và tổng số đánh giá
  const calculateRatingStats = (reviews) => {
    if (!reviews.length) {
      setAverageRating(0);
      setReviewCount(0);
      return;
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    setAverageRating(totalRating / reviews.length);
    setReviewCount(reviews.length);
  };

  // Fetch bình luận từ API
  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/reviews/get?productId=${productId}`,
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        setReviews(response.data.reviews);
        calculateRatingStats(response.data.reviews);
      }
    } catch (error) {
      console.error("Error fetching reviews", error);
    }
  };

  // Gửi đánh giá mới
  const handleSubmitReview = async () => {
    if (rating < 1) {
      toast.error("Đánh giá phải có ít nhất 1 sao!");
      return;
    }

    if (!review.trim()) {
      toast.error("Bạn cần nhập bình luận!");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/reviews/add`,
        {
          productId,
          rating,
          comment: review,
          nameuser: userName || "Ẩn danh", // Gửi nameuser
        },
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        setReviews([
          ...reviews,
          {
            rating,
            comment: review,
            nameuser: userName || "Ẩn danh", // Lưu nameuser
            date: new Date().toISOString(),
          },
        ]);
        calculateRatingStats([
          ...reviews,
          {
            rating,
            comment: review,
            nameuser: userName || "Ẩn danh", // Lưu nameuser
            date: new Date().toISOString(),
          },
        ]);
        setReview("");
        setRating(0);
        setUserName(""); // Reset tên người dùng
        toast.success("Đánh giá thành công");
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting review", error);
    }
  };

  useEffect(() => {
    fetchProductData();
    fetchReviews();
  }, [productId]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Image */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="w-full sm:w-[80%]">
            <img className="w-96 h-96" src={image} alt="" />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h2 className="font-medium text-2xl mt-2">{productData.name}</h2>
          <p className="text-gray-500 text-sm mt-1">Số lượng: {productData.soLuong || "Thông tin đang cập nhật"}</p>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, index) => (
              <img
                key={index}
                className="w-5"
                src={index < averageRating ? assets.star_icon : assets.blackstar_icon}
                alt=""
              />
            ))}
            <p className="pl-2">
              {averageRating.toFixed(1)} ({reviewCount || 0})
            </p>
          </div>
          <p className="mt-5 text-3xl font-medium">
            {productData.price.toLocaleString("vi-VN")} {currency}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>

          {/* Buttons */}
          <div className="mt-5 flex gap-4">
            <button
              onClick={() => addToCart(productData._id)}
              className="bg-green-400 text-yellow-300 px-8 py-3 text-sm active:bg-green-700"
            >
              THÊM VÀO GIỎ HÀNG
            </button>
            <button
              onClick={() => addToWish(productData._id)}
              className="bg-red-400 text-yellow-300 px-8 py-3 text-sm active:bg-red-700"
            >
              YÊU THÍCH
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-13">
        <div className="flex">
          <button
            className={`border px-5 py-3 text-sm ${activeTab === "info" ? "font-bold" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            Thông tin
          </button>
          <button
            className={`border px-5 py-3 text-sm ${activeTab === "review" ? "font-bold" : ""}`}
            onClick={() => setActiveTab("review")}
          >
            Đánh giá
          </button>
          <button
            className={`border px-5 py-3 text-sm ${activeTab === "xemReview" ? "font-bold" : ""}`}
            onClick={() => setActiveTab("xemReview")}
          >
            Xem đánh giá
          </button>
        </div>

        {/* Nội dung tab */}
        {activeTab === "info" ? (
          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
            <b>Công dụng:</b>
            <p>{productData.description}</p>
            <b>Thành phần:</b>
            <p>{productData.ingredients || "Thông tin đang cập nhật"}</p>
          </div>
        ) : activeTab === "review" ? (
          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
            <h3 className="font-semibold">Đánh giá của bạn:</h3>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Nhập tên của bạn"
              className="w-full mt-3 p-2 border rounded"
            />
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, index) => (
                <img
                  key={index}
                  src={index < rating ? assets.star_icon : assets.blackstar_icon}
                  onClick={() => setRating(index + 1)}
                  alt=""
                  className="w-6 h-6 cursor-pointer"
                />
              ))}
            </div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Viết đánh giá của bạn ở đây..."
              className="w-full mt-3 p-2 border rounded"
              rows="3"
            ></textarea>
            <button
              onClick={handleSubmitReview}
              className="w-36 mt-3 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Gửi đánh giá
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
            <h3 className="font-semibold">Đánh giá người dùng:</h3>
            {reviews.map((review, index) => (
              <div key={index} className="mt-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      src={i < review.rating ? assets.star_icon : assets.blackstar_icon}
                      alt=""
                      className="w-4 h-4"
                    />
                  ))}
                </div>
                <p>{review.comment}</p>
                <p className="text-gray-500 font-semibold">{review.nameuser || "Ẩn danh"}</p>
                <small className="text-gray-500">
                  {new Date(review.date).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
