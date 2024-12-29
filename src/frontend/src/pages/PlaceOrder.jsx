import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const [discountAmount, setDiscountAmount] = useState(0);
  const [method, setMethod] = useState('cod');
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, setProducts } = useContext(ShopContext);
  const [discountCode, setDiscountCode] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const onDiscountChange = (event) => {
    setDiscountCode(event.target.value);
  };

  const applyDiscount = () => {
    const discountCodes = {
      'SALE10': 0.1,
      'SAVE18': 0.18,
    };

    if (discountCodes[discountCode]) {
      const discount = getCartAmount() * discountCodes[discountCode];
      setDiscountAmount(discount);
      toast.success('Mã giảm giá đã được áp dụng!');
    } else {
      setDiscountAmount(0);
      toast.error('Mã giảm giá không hợp lệ!');
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!cartItems || Object.keys(cartItems).length === 0) {
      toast.error('Giỏ hàng của bạn hiện tại không có sản phẩm!');
      return;
    }
    try {
      const orderItems = Object.entries(cartItems)
        .filter(([id, quantity]) => quantity > 0)
        .map(([id, quantity]) => {
          const product = products.find((p) => p._id === id);
          if (product) {
            return { ...product, quantity };
          }
          return null;
        })
        .filter((item) => item !== null);

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee - discountAmount,
      };

      switch (method) {
        case 'cod':
          try {
            const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } });
            if (response.data.success) {
              const updatedProducts = products.map((product) => {
                const orderedItem = orderItems.find((item) => item._id === product._id);
                if (orderedItem) {
                  return { ...product, soLuong: product.soLuong - orderedItem.quantity };
                }
                return product;
              });
              setProducts(updatedProducts);
              setCartItems({});
              navigate('/orders');
            } else {
              toast.error(response.data.message);
            }
          } catch (error) {
            console.error('Error placing COD order:', error);
            toast.error('Đã xảy ra lỗi khi đặt hàng COD!');
          }
          break;

        case 'stripe':
          try {
            const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } });
            if (responseStripe.data.success) {
              const { session_url } = responseStripe.data;

              // Cập nhật số lượng sản phẩm sau khi thành công
              const updatedProducts = products.map((product) => {
                const orderedItem = orderItems.find((item) => item._id === product._id);
                if (orderedItem) {
                  return { ...product, soLuong: product.soLuong - orderedItem.quantity };
                }
                return product;
              });
              setProducts(updatedProducts);
              setCartItems({});

              window.location.replace(session_url);
            } else {
              toast.error(responseStripe.data.message);
            }
          } catch (error) {
            console.error('Error placing Stripe order:', error);
            toast.error('Đã xảy ra lỗi khi đặt hàng qua Stripe!');
          }
          break;

        default:
          break;
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const totalAmountAfterDiscount = getCartAmount() + delivery_fee - discountAmount;

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'PHƯƠNG THỨC '} text2={'VẬN CHUYỂN'} />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Họ' />
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Tên' />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Đường' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Thành phố' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Tỉnh' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Quốc gia' />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Số điện thoại ' />
      </div>

      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
          <input
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full mt-4'
            type="text"
            placeholder='Nhập mã giảm giá'
            value={discountCode}
            onChange={onDiscountChange}
          />
          <button
            type="button"
            onClick={applyDiscount}
            className='bg-black text-white px-4 py-2 text-sm mt-4'>
            ÁP DỤNG
          </button>
          {discountAmount > 0 && (
            <div className='mt-2 text-green-500'>
              Mã giảm giá đã được áp dụng. Bạn đã tiết kiệm {discountAmount.toLocaleString("vi-VN")} VND.
            </div>
          )}
        </div>

        <div className='mt-4'>
          <Title text1={'TỔNG TIỀN'} text2={' SAU KHI GIẢM GIÁ'} />
          <div className='text-xl font-bold'>
            {totalAmountAfterDiscount.toLocaleString("vi-VN")} VND
          </div>
        </div>

        <div className='mt-7'>
          <Title text1={'PHƯƠNG THỨC '} text2={'THANH TOÁN'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border-[2px] p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border-[2px] rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border-[2px] p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border-[2px] rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>THANH TOÁN KHI NHẬN HÀNG</p>
            </div>
          </div>
        </div>
        <div className='w-full text-end mt-8'>
          <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>ĐẶT HÀNG</button>
        </div>
      </div>
    </form>
  );
};


export default PlaceOrder;
