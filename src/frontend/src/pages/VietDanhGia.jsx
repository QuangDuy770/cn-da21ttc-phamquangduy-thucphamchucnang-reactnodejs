import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets";

const VietDanhGia = () => {
  const { orderid } = useParams(); // Lấy orderid từ URL
  const [orderData, setOrderData] = useState(null); // Lưu trữ thông tin đơn hàng
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchOrderData = async () => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage

    if (!token) {
      console.error("Token không tồn tại. Không thể tải dữ liệu.");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (response.status === 200 && response.data.orders) {
        const matchingOrder = response.data.orders.find(
          (order) => order._id === orderid
        );
        if (matchingOrder) {
          setOrderData(matchingOrder);
        } else {
          console.error("Không tìm thấy đơn hàng với orderid:", orderid);
        }
      } else {
        console.error("API không trả về orders hoặc lỗi dữ liệu:", response.data);
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${backendUrl}/api/review/${orderid}/add`,
        { rating, comment }
      );

      if (response.status === 201) {
        setSuccessMessage("Đánh giá của bạn đã được gửi thành công!");
        setRating(0);
        setComment("");
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrorMessage(
        error.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá."
      );
      setSuccessMessage("");
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [orderid]);

  return (
    <div className="max-w-md mx-auto px-6 py-8">
      {orderData && (
        <div className="mb-6 border-b pb-4">
          <h2 className="text-lg font-semibold">Sản phẩm trong đơn hàng:</h2>
          {orderData.items.map((product) => (
            <div key={product._id} className="flex items-start gap-4 mt-4">
              <img
                className="w-24 h-24 object-cover"
                src={product.image[0]}
                alt={product.name}
              />
              <div>
                <h4 className="font-medium text-lg">{product.name}</h4>
                <p className="text-gray-500">
                  Giá: {product.price.toLocaleString("vi-VN")} VND
                </p>
                <p className="text-gray-500">Số lượng: {product.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-lg font-semibold mb-4">Viết đánh giá của bạn</h2>
      {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Đánh giá (số sao):</label>
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < rating ? assets.star_icon : assets.blackstar_icon}
                alt="star"
                className="w-8 h-8 cursor-pointer"
                onClick={() => setRating(i + 1)}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2">Bình luận:</label>
          <textarea
            className="w-full border border-gray-300 rounded p-2"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Viết bình luận của bạn..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Gửi đánh giá
        </button>
      </form>
    </div>
  );
};

export default VietDanhGia;
