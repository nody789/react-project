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
    console.log("Cart data updated:", cartData)
  }, [getCart]);


  const closeDeleteModal = () => {
    deleteModal.current.hide();
  }
  const openDeleteModal = (cartItem, variantId) => {
    setCurrentCartData({
      id: cartItem.product_id,
      variantId: variantId,
      product: cartItem.product,
    });
    deleteModal.current.show();
  };

  const removeCartItem = async (productId, variantId) => {
    // 確保 cartData.carts 是一個陣列
    const existingCartItem = Array.isArray(cartData.carts)
      ? cartData.carts.find(item => item.product_id === productId)
      : null;

    if (existingCartItem) {
      // 找到現有的變體，並過濾出不匹配的變體（即保留其他變體）
      const updatedVariants = existingCartItem.variants.filter(
        variant => variant.id !== variantId
      );

      let updatedCartData;

      if (updatedVariants.length > 0) {
        // 如果還有其他變體，更新該項目
        updatedCartData = {
          product_id: productId,
          qty: existingCartItem.qty,
          variants: updatedVariants,
        };
      } else {
        // 如果沒有剩餘變體，則刪除整個項目
        updatedCartData = null;
      }

      try {
        if (updatedCartData) {
          // 更新購物車中的該項目
          await axios.put(
            `/v2/api/${process.env.REACT_APP_API_PATH}/cart/${existingCartItem.id}`,
            { data: updatedCartData }
          );
        } else {
          // 如果沒有變體則刪除整個購物車項目
          await axios.delete(
            `/v2/api/${process.env.REACT_APP_API_PATH}/cart/${existingCartItem.id}`
          );
        }
        dispatch(createAsyncMessage({ success: true, message: "成功移除我的購物車" }));
        getCart(); // 刷新購物車
      } catch (error) {
        console.error("移除購物車項目時發生錯誤:", error.response?.data || error.message);
      }

      closeDeleteModal();
    } else {
      alert(`購物車中無此項目。Product ID: ${productId}, Variant ID: ${variantId}`);
    }
  };





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

  const updateCartItem = async (item, variantId, newVariantNum) => {
    // 更新變體的数量
    const updatedVariants = item.variants.map(variant =>
      variant.id === variantId ? { ...variant, num: newVariantNum } : variant
    );
  
    // 計算所有的
    const updatedTotal = updatedVariants.reduce((acc, variant) => acc + (variant.num * item.product.price), 0);
  
    // 计算所有遍體的數量
    const updatedQuantity = updatedVariants.reduce((acc, variant) => acc + variant.num, 0);
  
    // 更新購物車選項
    const updatedItem = {
      ...item,
      variants: updatedVariants,
      total: updatedTotal,
      qty: updatedQuantity, 
    };
  
    setLoadingItems([...loadingItems, item.id]);
  

    try {
      const res = await axios.put(`/v2/api/${process.env.REACT_APP_API_PATH}/cart/${item.id}`, { data: updatedItem });
      setLoadingItems(loadingItems.filter((loadingObject) => loadingObject !== item.id));
      dispatch(createAsyncMessage(res.data));
  
      getCart();
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };
  
  

  return (
    <>
      <div className='container'>
        <Loading isLoading={isLoading} />
        <DeleteModal
          close={closeDeleteModal}
          text={`${currentCartData?.product?.title}${currentCartData?.variantId}`}
          handleDelete={() =>
            removeCartItem(currentCartData?.id, currentCartData?.variantId)
          }
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
                            item.variants.map((variant, index) => (
                              <React.Fragment key={`${item.id}-${variant.id}`}>
                                <tr>
                                  <td className="p-0">
                                    <img src={item.product.imageUrl} alt={item.product.title} className="cart-img" />
                                  </td>
                                  <td>{item.product.title}</td>
                                  <td>{variant.color}</td>
                                  <td>{variant.size}</td>
                                  <td>
                                    <select
                                      className="form-select"
                                      value={variant.num}
                                      disabled={loadingItems.includes(item.id)}
                                      onChange={(e) => {
                                        const newVariantNum = parseInt(e.target.value);
                                        updateCartItem(item, variant.id, newVariantNum); 
                                      }}
                                    >
                                      {[...new Array(20)].map((_, num) => (
                                        <option value={num + 1} key={num}>
                                          {num + 1}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td>NT$ {variant.num * item.product.price}</td>
                                  <td className="text-end p-0">
                                    <button
                                      type="button"
                                      className="btn p-0"
                                      onClick={() => openDeleteModal(item, variant.id)}
                                    >
                                      <i className="bi bi-x-lg"></i>
                                    </button>
                                  </td>
                                </tr>
                                {/* spacer row with unique key */}
                                <tr style={{ height: '20px' }} key={`spacer-${item.id}-${variant.id}-${index}`}></tr>
                              </React.Fragment>
                            ))
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
                              className="btn"
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