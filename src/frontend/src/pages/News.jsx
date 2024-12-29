import React from 'react';
import { Link } from 'react-router-dom'; // Import Link từ react-router-dom
import { news } from "../assets/assets";
import Title from '../components/Title';

const News = () => {
  return (
    <div className=''>
      {/* Tiêu đề */}
      <div className='text-center mb-6 text-2xl'>
        <Title text1={'TIN TỨC '} text2={'SỨC KHỎE'} />
      </div>

      <div className='grid gap-6'>
        {news.map((item) => (
          // Bọc div bằng Link để điều hướng khi bấm vào bất kỳ vị trí nào trong div
          <Link key={item.id} to={`/news/${item.id}`} className="block">
            <div className='bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow'>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>{item.title}</h3>
              <p className='text-xs text-gray-500 mb-2'>{item.date}</p>
              <p className='text-sm text-gray-700'>{item.excerpt}</p>

              {/* Nút Đọc thêm */}
              <span className='mt-4 text-blue-500 text-sm font-medium hover:underline'>
                Đọc thêm
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default News;
