import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';

const Orders = () => {

  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([])

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        const allOrdersItem = response.data.orders.flatMap((order) =>
          order.items.map((item) => ({
            ...item,
            status: order.status,
            payment: order.payment,
            paymentMethod: order.paymentMethod,
            date: order.date,
          }))
        );

        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error("Error loading order data:", error);
    }
  };


  useEffect(() => {
    loadOrderData()
  }, [token])

  return (
    <div className='border-t pt-26'>

      <div className='text-2xl'>
        <Title text1={'ĐƠN HÀNG '} text2={'CỦA TÔI'} />
      </div>

      <div>
        {
          orderData.map((item, index) => (
            <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-stretch md:justify-between gap-4'>
              <div className='flex flex-1 items-start gap-6 text-sm'>
                <img className='w-16 sm:w-20' src={item.image} alt="" />
                <div className='flex-1'>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                    <p>{item.price.toLocaleString("vi-VN")}{' '}{currency}</p>
                    <p>Số lượng: {item.quantity}</p>
                  </div>
                  <p className='mt-1'>Ngày đặt: <span className='text-gray-400'>{new Date(item.date).toLocaleDateString()}</span></p>
                  <p className='mt-1'>Thanh toán: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                </div>
              </div>
              <div className='md:w-1/2 flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                  <p className='w-2 h-2 rounded-full bg-green-500'></p>
                  <p className='text-sm md:text-base'>{item.status}</p>
                </div>
                <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Kiểm tra</button>
              </div>
            </div>

          ))
        }
      </div>

    </div>
  )
}

export default Orders
