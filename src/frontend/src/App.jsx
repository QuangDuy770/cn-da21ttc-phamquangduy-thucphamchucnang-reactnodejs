import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Tintuc from './pages/News'
import Wishlist from './pages/Wishlist'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Contact from './pages/Contact'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import Verify from './pages/Verify'
import Review from './pages/Review'
import VietDanhGia from './pages/VietDanhGia'

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <ToastContainer/>
        <Navbar/>
        <SearchBar/>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/collection' element={<Collection/>}/>
          <Route path='/news' element={<News/>}/>
          <Route path='/news/:id' element={<NewsDetail/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/wishlist' element={<Wishlist/>}/>
          <Route path='/product/:productId' element={<Product/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/place-order' element={<PlaceOrder/>}/>
          <Route path='/orders' element={<Orders/>}/>
          <Route path='/verify' element={<Verify/>}/>
          <Route path='/review' element={<Review/>}/>
          <Route path='/danhgia/:orderid' element={<VietDanhGia/>}/>
        </Routes>
        <Footer/>
    </div>
  )
}

export default App
