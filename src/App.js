import { Routes, Route, useLocation } from 'react-router-dom';
import React,{ useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCoupons from './pages/admin/AdminCoupons';
import FrontLayout from './pages/front/FrontLayout';
import Home from './pages/front/Home';
import Products from './pages/front/Products';
import ProductDetail from './pages/front/ProductDetail';
import Cart from './pages/front/Cart';
import Checkout from './pages/front/Checkout';
import CheckoutSuccess from './pages/front/CheckoutSuccess';
import Favorite from './pages/front/Favorite';
import Search from './pages/front/Search';
import ShoppingStore from './pages/front/ShoppingStore';


function App() {
  // useEffect(()=>{
  //   //可以把這個省略process.env.REACT_APP_API_URL到app.js
  //   console.log(process.env.REACT_APP_API_URL,process.env.REACT_APP_API_PATH);
  //   (async()=>{
  //  const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products/all`);
  //  console.log(res);
  //   })()
  // },[])
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="App">
          <Routes>
        <Route path='/' element={<FrontLayout />}>
          <Route path='/' element={<Home />}></Route>
          <Route path='products/:category' element={<Products />}></Route>
          <Route path='product/:id' element={<ProductDetail />}></Route>
          <Route path='cart' element={<Cart />}></Route>
          <Route path='checkout' element={<Checkout />}></Route>
          <Route path='success/:orderId' element={<CheckoutSuccess />}></Route>
          <Route path='favorite' element={<Favorite />}></Route>
          <Route path='search' element={<Search />}></Route>
          <Route path='ShoppingStore' element={<ShoppingStore />}></Route>
        </Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/admin' element={<Dashboard />}>
          <Route path='products' element={<AdminProducts />}></Route>
          <Route path='coupons' element={<AdminCoupons />}></Route>
          <Route path='orders' element={<AdminOrders />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
