import React from 'react'
import { assets } from '../assets/assets'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import {toast} from 'react-toastify'

const Add = ({token}) => {

  const [image1,setImage1] = useState(false)

  const [name,setName] = useState("")
  const [description,setDescription] = useState("")
  const [thanhPhan,setThanhPhan] = useState("")
  const [price,setPrice] = useState("")
  const [category,setCategory] = useState("Sức khỏe")
  const [bestseller,setBestseller] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {

      const formData = new FormData()

      formData.append("name",name)
      formData.append("description",description)
      formData.append("thanhPhan",thanhPhan)
      formData.append("price",price)
      formData.append("category",category)
      formData.append("bestseller",bestseller)

      image1 && formData.append("image1",image1)

      const response = await axios.post(backendUrl + "/api/product/add",formData,{headers:{token}})

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setThanhPhan('')
        setImage1(false)
        setPrice('')
      }else{
        toast.error(response.data.message)
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Tải ảnh lên</p>

        <div>
          <label htmlFor="image1">
            <img className='w-20 cursor-pointer' src={ !image1 ? assets.upload_icon :URL.createObjectURL(image1)} alt="" />
            <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden />
          </label>
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Tên sản phẩm</p>
        <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Nhập tên sản phẩm' required />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Mô tả sản phẩm</p>
        <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Nhập mô tả' required />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Thành phần sản phẩm</p>
        <textarea onChange={(e)=>setThanhPhan(e.target.value)} value={thanhPhan} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Nhập thành phần' required />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>

        <div>
          <p className='mb-2'>Loại sản phẩm</p>
          <select onChange={(e)=>setCategory(e.target.value)} className='w-full px-3 py-2'>
            <option value='Sức khỏe'>Sức khỏe</option>
            <option value='Vitamin'>Vitamin</option>
            <option value='Xương khớp'>Xương khớp</option>
            <option value='Tiêu hóa'>Tiêu hóa</option>
            <option value='Giảm cân'>Giảm cân</option>
            <option value='Làm đẹp'>Làm đẹp</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Giá sản phẩm</p>
          <input onChange={(e)=>setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="Number" placeholder='100000' />
        </div>
      </div>

      <div className='flex gap-2 mt-2'>
        <input onChange={(e)=>setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller'/>
        <label className='cursor-pointer' htmlFor="bestseller">Thêm vào sản phẩm bán chạy</label>
      </div>

      <button type="submit" className='w-28 py-3 mt-4 bg-rose-400 text-white'>THÊM</button>

    </form>
  )
}

export default Add
