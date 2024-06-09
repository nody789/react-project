import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Outlet } from "react-router";
import axios from "axios";
import MessageToast from "../../components/MessageToast";
import Footer from "../../components/Footer";
function FrontLayout(){
    const [cartData,setCartData] = useState({});
    const getCart = async()=>{
        try {
            const res  =await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/cart`);
        console.log('購物車內容',res)
        setCartData(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }
 useEffect(()=>{
    getCart();
 },[])
return(
    <>
    <Navbar cartData={cartData}/>
    <MessageToast/>
    <Outlet context={{getCart,cartData}} ></Outlet>
    <Footer></Footer>
    </>
)
}
export default FrontLayout