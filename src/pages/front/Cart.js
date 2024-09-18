import { useOutletContext } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from 'react-redux';
import { Modal } from "bootstrap";
import { createAsyncMessage } from "../../slice/messageSlice";
import Loading from "../../components/Loading";
import Stepper from "../../components/Stepper";
import DeleteModal from "../../components/DeleteModal";

function Cart() {
  const { cartData, getCart } = useOutletContext();
  const [currentCartData, setCurrentCartData] = useState([]); // 保存当前商品信息
  const [loadingItems, setLoadingItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState('');
  const hasCoupon = cartData?.final_total !== cartData?.total;
  const deleteModal = useRef(null);


  const dispatch = useDispatch();
  useEffect(() => {
    deleteModal.current = new Modal('#deleteModal', { backdrop: 'static' });
  }, [getCart]);

  const openDeleteModal = (cartData) => {
    setCurrentCartData(cartData);
    deleteModal.current.show();
  }
  const closeDeleteModal = () => {
    deleteModal.current.hide();
  }

  const removeCartItem = async (id) => {
    try {
      const res = await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/cart/${id}`);
      if (res.data.success) {
        dispatch(createAsyncMessage(res.data));
        closeDeleteModal();  // 確保刪除後關閉模態框
        getCart(); // 刷新購物車
      }
    } catch (error) {
      dispatch(createAsyncMessage(error));
    }
  }
  const applyCoupon = async () => {
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
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
      setLoadingItems(loadingItems.filter((loadingObject) => loadingObject !== item.id));
    }
  }

  return (
    <>
      <div className='container'>
        <Loading isLoading={isLoading} />
        <DeleteModal
          close={closeDeleteModal}
          text={currentCartData?.product?.title} //顯示當前產品名字
          handleDelete={() => removeCartItem(currentCartData?.id)} // 删除当前商品
          id={currentCartData?.id}
        />
          <div className='row justify-content-center'>
          <div className='col-12 col-md-10 col-lg-8'>
            <Stepper data={[
              { step: 1, content: '商品確認', done: true },
              { step: 2, content: '付款資訊', done: false },
              { step: 3, content: '訂單完成', done: false },
            ]}></Stepper>
            {cartData?.carts?.length === 0 ? (
              <>
                <div className='alert alert-secondary'>還沒有選擇商品喔</div>
                <Link
                  to='/products/all'
                  className='btn btn-primary text-white w-100 mt-4 rounded-0 py-3 mb-7'
                >
                  選擇商品
                </Link>
              </>
            ) : (
              <>
                <div className="card" style={{ borderColor: '#AD8F7E', borderRadius: '30px' }}>
                  <div
                    className="card-header bg-primary text-white tablePadding"
                    style={{ borderColor: '#AD8F7E', borderTopLeftRadius: '29px', borderTopRightRadius: '29px' }}
                  >
                    購物清單
                  </div>

                  <div className="card-body tablePadding">
                    <div className="table-responsive">
                      <table className="table mb-0" style={{ minWidth: '500px' }}>
                        <tbody className="align-middle border-white">
                          {cartData?.carts?.map((item) => (
                            <tr key={item.id}>
                              <td className="p-0">
                                <img src={item.product.imageUrl} alt="" className="cart-img" />
                              </td>
                              <td>{item.product.title}</td>
                              <td>{item.color}</td>
                              <td>{item.size}</td>
                              <td>
                                <select
                                  name=""
                                  className="form-select"
                                  value={item.qty}
                                  disabled={loadingItems.includes(item.id)}
                                  onChange={(e) => updateCartItem(item, e.target.value * 1)}
                                >
                                  {[...new Array(20)].map((_, num) => (
                                    <option value={num + 1} key={num}>
                                      {num + 1}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>NT${item.final_total}</td>
                              <td className="text-end p-0">
                                <button
                                  type="button"
                                  className="btn p-0"
                                  onClick={() => openDeleteModal(item)}
                                >
                                  <i className="bi bi-x-lg"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div
                    className="card-footer tablePadding border-none"
                    style={{ background: "#ffffff", borderRadius: "0 0 30px 30px" }}
                  >
                    <div className="d-flex align-items-center justify-content-between ">
                      <label htmlFor="coupon" className="me-3 fw-bold " >
                        折價代碼
                      </label>
                      {hasCoupon ? (
                        <p className="text-end text-success fw-bold mb-0">已套用優惠券</p>
                      ) : (
                        <div className="input-group w-50">
                          <input
                            style={{ borderColor: 'black', borderWidth: '0 0 2px 0' }}

                            type="text"
                            className="form-control rounded-0  border-top-0 border-start-0 border-end-0 shadow-none"
                            placeholder="請輸入折價代碼"
                            id="coupon"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            aria-label="Recipient's username"
                            aria-describedby="button-addon2"
                            disabled={hasCoupon}
                          />
                          <div className="input-group-append">
                            <button
                              className="btn btn-primary"
                              type="button"
                              id="button-addon2"
                              disabled={hasCoupon}
                              onClick={applyCoupon}
                              aria-label="Send Coupon"
                            >
                              <i className="bi bi-send-fill "></i>
                            </button>
                          </div>
                          <div
                            className="text-danger w-100"
                            style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}
                          >
                            {couponMsg}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="d-flex justify-content-between pt-3">
                      <p className="fw-bold mb-0">總金額</p>
                      <p className="fw-bold mb-0">NT${cartData.final_total}</p>
                    </div>

                  </div>
                </div>

                <div className="d-flex justify-content-center mb-7">
                  <Link
                    to='/checkout'
                    className='btn btn-primary btn-item mt-6 py-3 text-white'
                    style={{ width: "184px" }}
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