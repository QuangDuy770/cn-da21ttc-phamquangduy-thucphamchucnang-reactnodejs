import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = 'VND';
    const delivery_fee = 5000;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [wishItems, setWishItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const addToCart = async (itemId) => {
        let cartData = structuredClone(cartItems);

        const product = products.find((p) => p._id === itemId);
        if (!product) {
            toast.error('Sản phẩm không tồn tại!');
            return;
        }

        const currentQuantity = cartData[itemId] || 0;
        if (currentQuantity >= product.soLuong) {
            toast.error('Không thể đặt quá số lượng sản phẩm hiện có!');
            return;
        }

        cartData[itemId] = currentQuantity + 1;
        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId }, { headers: { token } });
                toast.success('Thêm sản phẩm vào giỏ hàng thành công!');
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        } else {
            toast.success('Thêm sản phẩm vào giỏ hàng thành công!');
        }
    };

    const canAddToCart = (itemId) => {
        const product = products.find((p) => p._id === itemId);
        const currentQuantity = cartItems[itemId] || 0;
        return product && currentQuantity < product.soLuong;
    };

    const addToWish = async (itemId) => {
        let wishData = structuredClone(wishItems);

        if (wishData[itemId]) {
            toast.info("Sản phẩm đã có trong danh sách yêu thích.");
            return;
        } else {
            wishData[itemId] = 1;
        }

        setWishItems(wishData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/wishlist/add', { itemId }, {
                    headers: { token }
                });

                toast.success("Sản phẩm đã được thêm vào danh sách yêu thích!");
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        } else {
            toast.info("Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích.");
        }
    };

    const removeFromWish = async (itemId) => {
        let updatedWishItems = { ...wishItems };
        delete updatedWishItems[itemId];
        setWishItems(updatedWishItems);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/wishlist/remove', { itemId }, {
                    headers: { token }
                });

                toast.success("Sản phẩm đã được xóa khỏi danh sách yêu thích");

            } catch (error) {
                console.log(error);
                toast.error("Lỗi khi xóa sản phẩm khỏi danh sách yêu thích");
            }
        }
    };

    const getWishCount = () => {
        return Object.keys(wishItems).length;
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                totalCount += cartItems[itemId];
            }
        }
        return totalCount;
    };

    const updateQuantity = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems);

        const product = products.find((p) => p._id === itemId);
        if (!product) {
            toast.error('Sản phẩm không tồn tại!');
            return;
        }

        if (quantity > product.soLuong) {
            toast.error('Không thể đặt quá số lượng sản phẩm hiện có!');
            return;
        }

        if (quantity < 1) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, quantity }, { headers: { token } });
                if (quantity < 1) {
                    toast.success('Sản phẩm đã được xóa khỏi giỏ hàng!');
                }
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } });
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const itemInfo = products.find((product) => product._id === itemId);
            if (itemInfo && cartItems[itemId] > 0) {
                totalAmount += itemInfo.price * cartItems[itemId];
            }
        }
        return totalAmount;
    };

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
            getUserCart(localStorage.getItem('token'));
        }
    }, []);

    useEffect(() => {
        if (token) {
            const fetchWishlist = async () => {
                try {
                    const response = await axios.post(backendUrl + '/api/wishlist/get', {}, { headers: { token } });
                    if (response.data.success) {
                        setWishItems(response.data.wishData);
                    }
                } catch (error) {
                    console.log("Error fetching wishlist:", error);
                    toast.error("Không thể tải dữ liệu wishlist");
                }
            };

            fetchWishlist();
        }
    }, [token]);

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,setProducts,
        cartItems, setCartItems, addToCart, wishItems, addToWish, removeFromWish,
        getCartCount, getWishCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        setToken, token,
        user, setUser
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
