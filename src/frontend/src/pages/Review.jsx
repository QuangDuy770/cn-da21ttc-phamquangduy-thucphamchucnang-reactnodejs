import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { assets } from "../assets/assets";

const Review = () => {
  const [data, setData] = useState([]); // Lưu trữ danh sách đánh giá từ API
  const [filteredData, setFilteredData] = useState([]); // Dữ liệu sau khi tìm kiếm
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate(); // Khởi tạo navigate

  // Hàm lấy dữ liệu từ API
  const fetchReviewsAndProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/review/get`);
      if (response.status === 200) {
        setData(response.data.reviews); // Lưu danh sách đánh giá vào state
        setFilteredData(response.data.reviews); // Khởi tạo dữ liệu hiển thị
      } else {
        console.error("Không thể lấy dữ liệu:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (!value) {
      // Nếu không có từ khóa, hiển thị tất cả
      setFilteredData(data);
      return;
    }

    // Lọc đánh giá dựa trên từ khóa trong sản phẩm
    const filtered = data
      .map((review) => ({
        ...review,
        items: review.items.filter((product) =>
          product.name.toLowerCase().includes(value)
        ),
      }))
      .filter((review) => review.items.length > 0); // Loại bỏ đánh giá không có sản phẩm khớp

    setFilteredData(filtered);
  };

  useEffect(() => {
    fetchReviewsAndProducts();
  }, []);

  if (data.length === 0) {
    return <p>Đang tải dữ liệu...</p>; // Hiển thị trạng thái tải
  }

  return (
    <div className="flex flex-col gap-6 px-6 py-6">
      <h3 className="font-semibold text-lg">Đánh giá của khách hàng:</h3>
      {/* Thanh tìm kiếm */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Tìm kiếm theo tên sản phẩm..."
        className="border p-2 rounded w-full sm:w-1/2 mb-4"
      />
      {/* Danh sách đánh giá */}
      {filteredData.map((review, index) => (
        <div key={index} className="border-b pb-4">
          {/* Thông tin người dùng */}
          <p className="text-sm">
            Người mua: <b>{review.firstName} {review.lastName}</b>
          </p>
          {/* Thông tin sản phẩm */}
          {review.items.map((product) => (
            <div
              key={product._id}
              className="flex items-start gap-4 cursor-pointer"
              onClick={() => navigate(`/product/${product._id}`)} // Chuyển đến trang sản phẩm
            >
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
          {/* Đánh giá */}
          <div className="mt-3">
            <h5 className="font-semibold text-sm">Đánh giá:</h5>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < review.rating
                      ? assets.star_icon // Sử dụng assets.star_icon
                      : assets.blackstar_icon // Sử dụng assets.blackstar_icon
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
      ))}
      {/* Nếu không tìm thấy kết quả */}
      {filteredData.length === 0 && (
        <p className="text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
      )}
    </div>
  );
};

export default Review;
