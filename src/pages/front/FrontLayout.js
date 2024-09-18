import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/Navbar";
import { Outlet } from "react-router";
import axios from "axios";
import MessageToast from "../../components/MessageToast";
import Footer from "../../components/Footer";
import { useDispatch} from 'react-redux';
import { createAsyncMessage, } from "../../slice/messageSlice";
function FrontLayout() {
  const [cartData, setCartData] = useState({});
  const dispatch = useDispatch();
  
    // 使用 useCallback 鎖定 getCart 函數，以避免不必要的重渲染
  const getCart = useCallback(async () => {
    try {
      const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/cart`);
      setCartData(res.data.data);
    } catch (error) {
      dispatch(createAsyncMessage({ success: false, message: error.response?.data?.message || '無法獲取購物車資料' }));
    }
  }, [dispatch]);

  useEffect(() => {
    getCart(); // 調用 getCart 函數
  }, [getCart]);
  return (
    <>
      <Navbar cartData={cartData} />
      <MessageToast />
      <Outlet context={{ getCart, cartData }} ></Outlet>
      <Footer></Footer>
    </>
  )
}
export default FrontLayout