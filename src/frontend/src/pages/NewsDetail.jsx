import React from 'react'
import { useParams } from 'react-router-dom'
import { news } from "../assets/assets"

const NewsDetail = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const article = news.find(item => item.id === parseInt(id)); // Tìm bài viết theo ID

  if (!article) {
    return <div>Bài viết không tồn tại</div>;
  }

  return (
    <div className="p-6">
      {/* Tiêu đề */}
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-2">{article.title}</h1>

      {/* Ngày tháng */}
      <p className="text-xs text-gray-500 text-center mb-6">{article.date}</p>

      {/* Nội dung bài viết */}
      <div className="flex items-center space-x-6">
        {/* Hình ảnh */}
        <img className="w-72 h-72 object-cover rounded-md" src={article.image} alt={article.title} />

        {/* Nội dung bài viết */}
        <div className="flex-1">
          <p className="text-sm text-gray-700">{article.content}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
