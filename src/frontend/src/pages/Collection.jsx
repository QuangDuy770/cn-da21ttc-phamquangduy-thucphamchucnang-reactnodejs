import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");
  const navigate = useNavigate(); // Sử dụng để điều hướng

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;

      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      <div className="min-w-60">
        <p className="my-2 text-xl flex items-center cursor-pointer gap-2">
          FILTERS
        </p>
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"
            } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CÔNG DỤNG</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Sức khỏe"}
                onChange={toggleCategory}
              />
              Sức khỏe
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Vitamin"}
                onChange={toggleCategory}
              />
              Vitamin
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Xương khớp"}
                onChange={toggleCategory}
              />
              Xương khớp
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Tiêu hóa"}
                onChange={toggleCategory}
              />
              Tiêu hóa
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Giảm cân"}
                onChange={toggleCategory}
              />
              Giảm cân
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Làm đẹp"}
                onChange={toggleCategory}
              />
              Làm đẹp
            </p>
          </div>
        </div>

        {/* New Section: Xem đánh giá */}
        <div className="border border-gray-300 pl-5 py-3 mt-6 bg-white rounded-md shadow-sm">
          <p className="mb-3 text-sm font-medium text-gray-800">ĐÁNH GIÁ</p>

          <div className="mt-4 flex justify-start">
            <button
              onClick={() => navigate("/review")} // Điều hướng đến trang đánh giá
              className="px-6 py-2 bg-rose-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors"
            >
              Xem đánh giá
            </button>
          </div>
        </div>

      </div>

      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"TẤT CẢ "} text2={"SẢN PHẨM"} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relavent">Sắp xếp: Không</option>
            <option value="low-high">Sắp xếp: Thấp đến cao</option>
            <option value="high-low">Sắp xếp: Cao đến thấp</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
