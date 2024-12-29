import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {

    const { setShowSearch, getCartCount, getWishCount, navigate, token, setToken, setCartItems, setWishlistItems } = useContext(ShopContext);

    const logout = () => {
        navigate('/login')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
        setWishlistItems({})
    }

    return (

        <div className='flex items-center justify-between font-medium'>
            <Link to={'/'}><img src={assets.logo} className='w-36' alt="" /></Link>
            <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>

                <NavLink to='/' className='flex flex-col items-center gap-1'>
                    <p>TRANG CHỦ</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700' hidden />
                    <p></p>
                </NavLink>
                <NavLink to='/collection' className='flex flex-col items-center gap-1'>
                    <p>SẢN PHẨM</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700' hidden />
                    <p></p>
                </NavLink>
                <NavLink to='/news' className='flex flex-col items-center gap-1'>
                    <p>TIN TỨC</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700' hidden />
                    <p></p>
                </NavLink>
                <NavLink to='/contact' className='flex flex-col items-center gap-1'>
                    <p>LIÊN HỆ</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700' hidden />
                    <p></p>
                </NavLink>

            </ul>

            <div className='flex items-center gap-6'>
                <img onClick={() => setShowSearch(true)} src={assets.search_icon} className='w-6 cursor-pointer' alt="" />

                <div className='group relative'>

                    <img onClick={() => token ? null : navigate('/login')} className='w-6 cursor-pointer' src={assets.profile_icon} alt="" />
                    {/* Dropdown menu */}
                    {token &&
                        <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                                
                                <p onClick={()=>navigate('/orders')} className='cursor-pointer hover:text-black'>Order</p>
                                <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
                            </div>
                        </div>}


                </div>
                <Link to='/wishlist' className='relative'>
                    <img src={assets.wishlist_icon} className='w-7 min-w-7' alt="" />
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-orange-400 text-black aspect-square rounded-full text-[8px]'>{getWishCount()}</p>
                </Link>
                <Link to='/cart' className='relative'>
                    <img src={assets.cart_icon} className='w-7 min-w-7' alt="" />
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-orange-400 text-black aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
                </Link>

            </div>
        </div>
    )
}

export default Navbar
