import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const { products, currency, wishItems, removeFromWish } = useContext(ShopContext);

    return (
        <div className='border-t pt-14'>
            <div className='text-2xl mb-3'>
                <Title text1={'DANH SÁCH '} text2={'YÊU THÍCH'} />
            </div>
            <div>
                {
                    Object.entries(wishItems).map(([itemId, itemData], index) => {
                        const productData = products.find((product) => product._id === itemId);

                        return (
                            <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                                <div className='flex items-start gap-6'>
                                    <Link to={`/product/${itemId}`} className='flex items-start gap-6'>
                                        <img className='w-16 sm:w-20' src={productData.image} alt={productData.name} />
                                        <div>
                                            <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                                            <p className='text-gray-500 text-sm'>Ngày thêm: {itemData.dateAdded}</p>
                                            <p className='mt-2'>{productData.price.toLocaleString("vi-VN")} {currency}</p>
                                        </div>
                                    </Link>
                                </div>
                                <div className='flex items-start gap-6'>
                                  <p></p>
                                </div>
                                <img 
                                    onClick={() => removeFromWish(itemId)} 
                                    className='w-7 mr-4 sm:w-8 cursor-pointer' 
                                    src={assets.bin_icon} 
                                    alt="Xóa" 
                                />
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default Wishlist;
