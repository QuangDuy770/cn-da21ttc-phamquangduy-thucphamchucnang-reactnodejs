import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center pt-10 py-0 text-xs sm:text-sm md:text-base text-gray-700 mt'>
      <div>
        <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="" />
        <p className='font-semibold'>Chính sách đổi hàng dễ dàng</p>
      </div>
      <div>
        <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="" />
        <p className='font-semibold'>Sản phẩm chất lượng</p>
      </div>
      <div>
        <img src={assets.support_icon} className='w-12 m-auto mb-5' alt="" />
        <p className='font-semibold'>Chăm sóc khách hàng 24/7</p>
      </div>
    </div>
  )
}

export default OurPolicy
