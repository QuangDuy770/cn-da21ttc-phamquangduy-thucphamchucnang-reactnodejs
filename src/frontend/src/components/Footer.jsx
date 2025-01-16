import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <div>
      <hr className='mt-32' />
      <div className='flex flex-col sm:grid grid-cols-[0.8fr_3fr_2fr_2fr] gap-14 my-2 mt-2 text-sm'>
        <div>
          <img src={assets.logo} className='mb-2 w-56' alt="" />
        </div>
        <div>
          <p className='text-xl font-medium mb-5'>LƯU Ý</p>
          <p className='w-full md:w-full text-gray-600'>
            Thông tin trên website này chỉ mang tính chất nội bộ tham khảo; không được xem là tư vấn y khoa và không nhằm mục đích thay thế cho tư vấn, chẩn đoán hoặc điều trị từ nhân viên y tế. Khi có vấn đề về sức khỏe hoặc cần hỗ trợ cấp cứu người đọc cần liên hệ bác sĩ và cơ sở y tế gần nhất.
          </p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>THÔNG TIN LIÊN HỆ</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>+1-121-383-8386</li>
            <li>contact@qd.com</li>
          </ul>
        </div>

        <div className='relative w-full h-40'>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1965.0680063461173!2d106.3466168!3d9.9226286!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0175ea296facb%3A0x55ded92e29068221!2sTr%C3%A0%20Vinh%20University!5e0!3m2!1sen!2s!4v1736835232941!5m2!1sen!2s" 
            className='absolute top-0 left-0 w-full h-full rounded shadow'
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps"
          ></iframe>
        </div>
      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2024@ pqd.com - All Right Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
