import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import axios from "axios";

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate(); // Khởi tạo navigate
  const { products, currency, addToCart, addToWish } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [averageRating, setAverageRating] = useState(0); // Trung bình số sao
  const [reviewCount, setReviewCount] = useState(0); // Số lượng đánh giá
  const [activeTab, setActiveTab] = useState("info"); // Quản lý tab hiện tại
  const [currentProductReviews, setCurrentProductReviews] = useState([]); // Đánh giá của sản phẩm hiện tại
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch dữ liệu sản phẩm
  const fetchProductData = async () => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image);
    }
  };

  // Fetch đánh giá và lọc theo sản phẩm hiện tại
  const fetchReviewsForCurrentProduct = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/review/get`);
      if (response.status === 200) {
        // Lọc đánh giá liên quan đến sản phẩm hiện tại
        const relatedReviews = response.data.reviews.filter((review) =>
          review.items.some((item) => item._id === productId)
        );
        setCurrentProductReviews(relatedReviews);

        // Tính toán trung bình số sao
        const totalRatings = relatedReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const totalReviews = relatedReviews.length;

        setAverageRating(totalReviews > 0 ? totalRatings / totalReviews : 0);
        setReviewCount(totalReviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchProductData();
    fetchReviewsForCurrentProduct();
  }, [productId]);

  if (!productData) {
    return <p>Đang tải dữ liệu sản phẩm...</p>;
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Image */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="w-full sm:w-[80%]">
            <img className="w-96 h-96" src={image} alt={productData.name} />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h2 className="font-medium text-2xl mt-2">{productData.name}</h2>
          <p className="text-gray-500 text-sm mt-1">
            Số lượng: {productData.soLuong || "Thông tin đang cập nhật"}
          </p>

          {/* Hiển thị số sao trung bình */}
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, index) => (
              <img
                key={index}
                className="w-5"
                src={
                  index < Math.round(averageRating)
                    ? assets.star_icon
                    : assets.blackstar_icon
                }
                alt="star"
              />
            ))}
            <p className="pl-2">
              {averageRating.toFixed(1)} ({reviewCount} đánh giá)
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
            className={`border px-5 py-3 text-sm ${
              activeTab === "info" ? "font-bold" : ""
            }`}
            onClick={() => setActiveTab("info")}
          >
            Thông tin
          </button>
          <button
            className={`border px-5 py-3 text-sm ${
              activeTab === "review" ? "font-bold" : ""
            }`}
            onClick={() => setActiveTab("review")}
          >
            Xem đánh giá
          </button>
        </div>

        {/* Nội dung tab */}
        {activeTab === "info" && (
          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
            <b>Công dụng:</b>
            <p>{productData.description}</p>
            <b>Thành phần:</b>
            <p>{productData.ingredients || "Thông tin đang cập nhật"}</p>
          </div>
        )}

        {activeTab === "review" && (
          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
            <h4 className="font-semibold text-lg">Đánh giá sản phẩm:</h4>
            {currentProductReviews.length > 0 ? (
              currentProductReviews.map((review, index) => (
                <div key={index} className="border-b pb-4">
                  <p className="text-sm">
                    Người mua: <b>{review.firstName} {review.lastName}</b>
                  </p>
                  <div className="mt-3">
                    <h5 className="font-semibold text-sm">Đánh giá:</h5>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <img
                          key={i}
                          src={
                            i < review.rating
                              ? assets.star_icon
                              : assets.blackstar_icon
                          }
                          alt="star"
                          className="w-4 h-4"
                        />
                      ))}
                    </div>
                    <p className="text-sm mt-1">{review.comment}</p>
                    <small className="text-gray-500">
                      {new Date(review.createdAt).toLocaleString()}
                    </small>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                Không có đánh giá nào cho sản phẩm này.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
