import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Stepper from "../../components/Stepper";
import { createAsyncMessage, } from "../../slice/messageSlice";
import { useDispatch } from 'react-redux';
import Loading from "../../components/Loading";

function Success() {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState({});
  // const { getCart } = useOutletContext();
  // const [messageShown, setMessageShown] = useState(false); // 新增狀態
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();


  const getOrder = async (orderId) => {
    try {
      const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/order/${orderId}`)
      setOrderData(res.data.order);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      dispatch(createAsyncMessage({ success: false, message: error.response?.data?.message || '操作失敗' }));
    }
  }

  useEffect(() => {
    getOrder(orderId);
  }, [orderId])


  const payOrder = async (orderId) => {
    try {
      setIsLoading(true);
      const data = {
        order: orderData,
      }
      const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/pay/${orderId}`, data);
      dispatch(createAsyncMessage({ success: true, message: res.data.message || '支付成功' }));
      await getOrder(orderId);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      dispatch(createAsyncMessage({ success: false, message: error.response?.data?.message || '支付失敗' }));
    }
  }
  
  return (
    <div className='container'>
      <Loading isLoading={isLoading} />

      <div className='row  justify-content-center '>
        <div className='col-12 col-md-10 col-lg-8'>
          <Stepper data={[
            { step: 1, content: '商品確認', done: true },
            { step: 2, content: '付款資訊', done: true },
            { step: 3, content: '訂單完成', done: true },
          ]}></Stepper>
            <h4 className="text-center mb-4">訂購完成</h4>
          <div className="card " style={{ borderColor: '#AD8F7E', borderRadius: '30px' }}>
            <div
              className="card-header bg-primary d-flex align-items-center text-white  tablePadding"
              style={{ borderColor: '#AD8F7E', borderTopLeftRadius: '29px', borderTopRightRadius: '29px' }}
            >
              <p className="m-0">訂單編號: {orderData?.id}</p>
            </div>

            <div className="card-body tablePadding">
              {Object.values(orderData?.products || {}).map((item) => (
                <div className="d-flex justify-content-between align-items-end " key={item.id}>
                  <img
                    src={item.product.imageUrl}
                    alt=""
                    className="cart-img me-3"
                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                  />
                  <p >{item.product.title}</p>
                  <p >{item.color}</p>
                  <p >{item.size}</p>
                  <p >{item.qty}</p>
                  <p >{item.final_total}</p>
                </div>
              ))}
            </div>
            <div
              className="card-footer tablePadding"
              style={{ background: "#ffffff", borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px' }}
            >
              <div className="d-flex justify-content-between">
                <p className="mb-0 fw-bold">折價</p>
                <p className="mb-0 fw-bold">0</p>
              </div>
              <div className="d-flex justify-content-between mt-3">
                <p className="mb-0 fw-bold">總計</p>
                <p className="mb-0 fw-bold">NT${orderData?.total}</p>
              </div>
            </div>
          </div>

          <div className="card  mt-6" style={{ borderColor: '#AD8F7E', borderRadius: '30px' }}>
            <div
              className="card-header bg-primary tablePadding d-flex text-white"
              style={{ borderColor: '#AD8F7E', borderTopLeftRadius: '29px', borderTopRightRadius: '29px' }}
            >
              <p className="m-0">顧客資訊</p>
            </div>
            <div className="card-body tablePadding">
              <div>
                <p>姓名:{orderData?.user?.name}</p>
                <p>電話:{orderData?.user?.tel}</p>
                <p>地址:{orderData?.user?.address}</p>
                <div className="d-flex">
                  <p>付款狀態 / </p>
                  <p className={`${orderData.is_paid ? 'text-success' : 'text-danger'} `}>{orderData.is_paid ? '已付款' : '未付款'}</p>
                </div>
                <hr className="new1" />
                <h5 className="h5">備註事項</h5>
                <p className="pb-5">{orderData?.user?.comment}</p>
              </div>
            </div>
          </div>

          <div className={`d-flex justify-content-between my-5 ${orderData.is_paid ? 'd-none' : ''}`}>
            <Link to="/" style={{ width: "184px" }}
              className="btn btn-primary btn-item  py-3 text-white "> 回到首頁</Link>

            <Link to="" className="btn btn-dark  btn-item  py-3" style={{ width: "184px" }}
              onClick={() => payOrder(orderId)}
            >前往付款</Link>
          </div>
          <div className={`d-flex justify-content-between my-5 ${orderData.is_paid ? '' : 'd-none'}`}>
            <Link to="/" className="btn btn-primary btn-item  py-3 text-white" style={{ width: "184px" }}>返回首頁</Link>
            <Link to="/products/all" className="btn btn-dark  btn-item  py-3" style={{ width: "184px" }}>繼續購物 </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Success;