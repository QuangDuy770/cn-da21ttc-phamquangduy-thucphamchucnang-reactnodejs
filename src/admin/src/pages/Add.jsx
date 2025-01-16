import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thanhPhan, setThanhPhan] = useState("");
  const [price, setPrice] = useState("");
  const [giaNhap, setGiaNhap] = useState(""); // Thêm giá nhập
  const [category, setCategory] = useState("Sức khỏe");
  const [bestseller, setBestseller] = useState(false);
  const [soLuong, setSoLuong] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Kiểm tra điều kiện giá nhập
    if (Number(giaNhap) >= Number(price)) {
      toast.error("Giá nhập phải nhỏ hơn giá sản phẩm!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("thanhPhan", thanhPhan);
      formData.append("price", price);
      formData.append("giaNhap", giaNhap); // Gửi giá nhập
      formData.append("category", category);
      formData.append("bestseller", bestseller);
      formData.append("soLuong", soLuong);
      if (image1) formData.append("image1", image1);

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        // Reset form
        setName("");
        setDescription("");
        setThanhPhan("");
        setPrice("");
        setGiaNhap(""); // Reset giá nhập
        setSoLuong("");
        setImage1(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      <div>
        <p className="mb-2">Tải ảnh lên</p>
        <div>
          <label htmlFor="image1">
            <img
              className="w-20 cursor-pointer"
              src={image1 ? URL.createObjectURL(image1) : assets.upload_icon}
              alt="Tải ảnh"
            />
            <input
              type="file"
              id="image1"
              hidden
              onChange={(e) => setImage1(e.target.files[0])}
              accept="image/*"
            />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Tên sản phẩm</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Nhập tên sản phẩm"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Mô tả sản phẩm</p>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Nhập mô tả"
          required
        ></textarea>
      </div>

      <div className="w-full">
        <p className="mb-2">Thành phần</p>
        <textarea
          value={thanhPhan}
          onChange={(e) => setThanhPhan(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Nhập thành phần"
          required
        ></textarea>
      </div>

      <div className="flex flex-wrap gap-3">
        <div>
          <p className="mb-2">Giá bán</p>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-40 px-3 py-2"
            type="number"
            placeholder="Nhập giá bán"
            required
          />
        </div>

        <div>
          <p className="mb-2">Giá nhập</p>
          <input
            value={giaNhap}
            onChange={(e) => setGiaNhap(e.target.value)}
            className="w-40 px-3 py-2"
            type="number"
            placeholder="Nhập giá nhập"
            required
          />
        </div>

        <div>
          <p className="mb-2">Số lượng</p>
          <input
            value={soLuong}
            onChange={(e) => setSoLuong(e.target.value)}
            className="w-40 px-3 py-2"
            type="number"
            placeholder="Số lượng"
            required
          />
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Danh mục</p>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2"
        >
          <option value="Sức khỏe">Sức khỏe</option>
          <option value="Vitamin">Vitamin</option>
          <option value="Xương khớp">Xương khớp</option>
          <option value="Tiêu hóa">Tiêu hóa</option>
          <option value="Giảm cân">Giảm cân</option>
          <option value="Làm đẹp">Làm đẹp</option>
        </select>
      </div>

      <div className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={bestseller}
          onChange={() => setBestseller((prev) => !prev)}
        />
        <label>Thêm vào danh sách bán chạy</label>
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-rose-400 text-white">
        THÊM
      </button>
    </form>
  );
};

export default Add;
