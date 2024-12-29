import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = () => {
    const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);

    // Tính tổng số tiền của các sản phẩm cộng với phí giao hàng
    const totalAmount = getCartAmount() + delivery_fee;

    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1={'THÀNH '} text2={'TIỀN'} />
            </div>

            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p>Tổng sản phẩm</p>
                    <p>{getCartAmount().toLocaleString("vi-VN")} {currency}</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p>Phí giao hàng</p>
                    <p>{delivery_fee.toLocaleString("vi-VN")} {currency}</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <b>Tổng tiền</b>
                    <b>{totalAmount.toLocaleString("vi-VN")} {currency}</b>
                </div>
            </div>
        </div>
    );
};

export default CartTotal;
