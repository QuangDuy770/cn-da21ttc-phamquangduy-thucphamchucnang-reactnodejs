import {v2 as cloudinary} from "cloudinary"
import productModel from "../models/productModel.js";

// function for add product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, thanhPhan, bestseller, soLuong } = req.body;

    // Kiểm tra nếu `image1` là một mảng hay không
    const image1 = Array.isArray(req.files.image1) ? req.files.image1 : [req.files.image1];

    let imagesUrl = await Promise.all(
      image1.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
        return result.secure_url;
      })
    );

    console.log(name, description, price, category, thanhPhan, bestseller, soLuong);
    console.log(imagesUrl);

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      thanhPhan,
      bestseller: bestseller === "true" ? true : false,
      soLuong: Number(soLuong), // Thêm số lượng
      image: imagesUrl,
      date: Date.now(),
    };
    console.log(productData);

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// function for list product
const listProduct = async (req, res) => {
  try {

    const products = await productModel.find({});
    res.json({success: true, products})

  } catch (error) {

    console.log(error);
    res.json({success: false, message:error.message})
    
  }
  
}

// function for remove product
const removeProduct = async (req, res) => {
  try {
    
    await productModel.findByIdAndDelete(req.body.id)
    res.json({success: true, message:"Product Removed"})

  } catch (error) {

    console.log(error);
    res.json({success: false, message:error.message})
    
  }
}

// function for single product info
const singleProduct = async (req, res) => {
  try {
    
    const { productId } = req.body
    const product = await productModel.findById(productId)
    res.json({ success:true, product})

  } catch (error) {
    
    console.log(error);
    res.json({success: false, message:error.message})
    
  }
}

export { listProduct, addProduct, removeProduct, singleProduct }