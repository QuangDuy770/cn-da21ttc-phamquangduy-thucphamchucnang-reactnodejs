import React, { useState } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Randomly select a discount code
    const codes = ['SALE10', 'SAVE18'];
    const selectedCode = codes[Math.floor(Math.random() * codes.length)];

    try {
      // Replace YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, YOUR_USER_ID with actual values from EmailJS
      await emailjs.send(
        'service_1gwcdtn', // Service ID của bạn
        'template_dayfxxc', // Template ID của bạn
        {
          name: formData.name,       // Tên người gửi
          email: formData.email,     // Email người nhận (được người dùng nhập vào)
          message: formData.message, // Nội dung tin nhắn
          discountCode: selectedCode // Mã giảm giá
        },
        'q4YqydmAbclJNfsYz' // Public Key (User ID) của bạn
      );
      

      toast.success('Thông tin đã được gửi thành công! Mã giảm giá đã được gửi vào email của bạn.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Gửi thông tin thất bại. Vui lòng thử lại sau.');
      console.error(error);
    }
  };

  return (
    <div className="text-center justify-center">
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={'LIÊN '} text2={'HỆ'} />
      </div>
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-12">
        
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center gap-4 max-w-md mx-auto"
      >
        <input
          type="text"
          name="name"
          placeholder="Tên của bạn"
          value={formData.name}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 w-full"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email của bạn"
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 w-full"
          required
        />
        <textarea
          name="message"
          placeholder="Phản hồi của bạn"
          value={formData.message}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2 w-full"
          rows="4"
          required
        />
        <button
          type="submit"
          className="bg-gray-800 text-white py-2 px-6 rounded-lg hover:bg-gray-300"
        >
          Gửi
        </button>
      </form>
    </div>
  );
};

export default Contact;
