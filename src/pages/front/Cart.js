import { useOutletContext } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { createAsyncMessage } from "../../slice/messageSlice";
import Loading from "../../components/Loading";
import Stepper from "../../components/Stepper";
function Cart() {
  const { cartData, getCart } = useOutletContext();
  const [loadingItems, setLoadingItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState('');
  const [stepper] = useState(1);
  const hascoupon = cartData?.final_total !== cartData?.total;


  const dispatch = useDispatch();
  const removeCartItem = async (id) => {
    try {
      const res = await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/cart/${id}`);
      dispatch(createAsyncMessage(res.data));
      getCart();
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }
  const sendCoupon = async () => {
    if (!couponCode) {
      return;
    }
    const data = {
      data: {
        code: couponCode,
      },
    };
    setIsLoading(true);
    try {
      const res = await axios.post(
        `/v2/api/${process.env.REACT_APP_API_PATH}/coupon`,
        data
      );
      if (res.data.success) {
        setCouponMsg('');
        getCart();
      }
      setIsLoading(false);
    } catch (error) {
      setCouponMsg(error?.response?.data?.message);
      setIsLoading(false);
    }
  };
  const updateCartItem = async (item, quantity) => {
    const data = {
      data: {
        product_id: item.product.id,
        qty: quantity
      }
    }
    setLoadingItems([...loadingItems, item.id])
    try {
      const res = await axios.put(`/v2/api/${process.env.REACT_APP_API_PATH}/cart/${item.id}`, data);
      setLoadingItems(loadingItems.filter((loadingObject) => loadingObject !== item.id));
      dispatch(createAsyncMessage(res.data))
      getCart();

      console.log(res)
    } catch (error) {
      console.log(error);
      dispatch(createAsyncMessage(error.response.data));
      setLoadingItems(loadingItems.filter((loadingObject) => loadingObject !== item.id));

    }
  }

  return (
    <>
      <div className='container'>
      <Loading isLoading={isLoading} />

        <div className='row justify-content-center'>
          <div className='col-md-8 bg-white full-height'>
            <Stepper   data={[
              { step: 1, content: '商品確認', done: true },
              { step: 2, content: '付款資訊', done: false },
              { step: 3, content: '訂單完成', done: false },
            ]}></Stepper>
            {cartData?.carts?.length === 0 ? (
              <>
                <div className='alert alert-secondary'>還沒有選擇商品喔</div>
                <Link
                  to='/products'
                  className='btn btn-dark w-100 mt-4 rounded-0 py-3'
                >
                  選擇商品
                </Link>
              </>
            ) : (
              <>
              <div className="bg-primary  tablePadding" style={{margin:"auto",borderRadius: "30px"}}>
                <table className='table table-primary'>
                <thead className="border-white">
                  <tr>
                    <td className="text-white" >商品圖片</td>
                    <td className="text-white" >商品名稱</td>
                    <td className="text-white" >顏色</td>
                    <td className="text-white" >尺寸</td>
                    <td className="text-white" >數量</td>
                    <td className="text-white" >價格</td>
                  </tr>
                </thead>
                <tbody className="align-middle border-white">
                  {cartData?.carts?.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td> <img
                        src={item.product.imageUrl}
                        alt=''
                        className='object-cover'
                        style={{
                          width: '60px',
                          height:'60px'
                        }}
                      /></td>
                        <td className="text-white" >{item.product.title}</td>
                        <td className="text-white" >{item.color}</td>
                        <td className="text-white" >{item.size}</td>
                        <td className="text-white" > <select
                              name=''
                              className='form-select'
                              id=''
                              value={item.qty}
                              disabled={loadingItems.includes(item.id)}
                              onChange={(e) => {
                                updateCartItem(item, e.target.value * 1);
                              }}
                            >
                              {[...new Array(20)].map((i, num) => {
                                return (
                                  <option value={num + 1} key={num}>
                                    {num + 1}
                                  </option>
                                );
                              })}
                            </select></td>
                            <td className="text-white" >NT${item.final_total}
                            <button
                          type='button'
                          className='btn'
                          onClick={() => {
                            removeCartItem(item.id);
                          }}
                        >
                          <i className='bi bi-x-lg'></i>
                        </button>
                            </td>  
                      </tr>
                    )
                  })
                }
                  </tbody>
                  </table>
                {/* {cartData?.carts?.map((item) => {
                  return (
                    <div className='d-flex mt-4 bg-light' key={item.id}>
                      <img
                        src={item.product.imageUrl}
                        alt=''
                        className='object-cover'
                        style={{
                          width: '120px',
                        }}
                      />
                      <div className='w-100 p-3 position-relative'>
                        <button
                          type='button'
                          className='position-absolute btn'
                          style={{ top: '10px', right: '10px' }}
                          onClick={() => {
                            removeCartItem(item.id);
                          }}
                        >
                          <i className='bi bi-x-lg'></i>
                        </button>
                        <p className='mb-0 fw-bold'>{item.product.title}</p>
                        <p
                          className='mb-1 text-muted'
                          style={{ fontSize: '14px' }}
                        >
                          {item.product.content}
                        </p>
                        <div className='d-flex justify-content-between align-items-center w-100'>
                          <div className='input-group w-50 align-items-center'>
                            <select
                              name=''
                              className='form-select'
                              id=''
                              value={item.qty}
                              disabled={loadingItems.includes(item.id)}
                              onChange={(e) => {
                                updateCartItem(item, e.target.value * 1);
                              }}
                            >
                              {[...new Array(20)].map((i, num) => {
                                return (
                                  <option value={num + 1} key={num}>
                                    {num + 1}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <p className='mb-0 ms-auto'>NT${item.final_total}</p>
                        </div>
                      </div>
                    </div>
                  );
                })} */}
                              <div className='d-flex align-items-center justify-content-between'>
                <label htmlFor='coupon' className='me-3'   style={{color:'#FFFFFF'}}>
                折價代碼
                </label>
                {hascoupon ? (
                  <p className='text-end text-success fw-bold mb-0'>
                    已套用優惠券
                  </p>
                ) : (
                  <div className='input-group w-50'>
                    <input
                      type='text'
                      className='form-control bg-primary text-white  rounded-0 border-bottom border-top-0 border-start-0 border-end-0 shadow-none'
                           
                      placeholder='請輸入折價代碼'
                      id='coupon'
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      aria-label="Recipient's username"
                      aria-describedby='button-addon2'
                      disabled={hascoupon}
                    />
                    <div className='input-group-append'>
                      <button
                        className='btn  border-bottom border-top-0 border-start-0 border-end-0 rounded-0'
                        type='button'
                        id='button-addon2'
                        disabled={hascoupon}
                        onClick={() => {
                          sendCoupon();
                        }}
                        aria-label='Send Coupon'
                      >
                        <i className='bi bi-send-fill text-white'></i>
                      </button>
                    </div>
                    <div
                      className='text-danger w-100'
                      style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}
                    >
                      {couponMsg}
                    </div>
                  </div>
                )}
              </div>
                <div className=' mt-3 text-white d-flex justify-content-between'>
                  <p className='mb-0 h5 fw-bold'>總金額</p>
                  <p className='mb-0 h5 fw-bold'>NT${cartData.final_total}</p>
                </div>
                 </div>
                 <div className="d-flex justify-content-center mb-7">
                <Link
                  to='/checkout'
                  className='btn btn-primary btn-item mt-6 py-3 text-white'
                  style={{width:"184px"}}
                >
                  確認商品正確
                </Link>

                 </div>
              </>
              
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Cart;