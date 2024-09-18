import axios from "axios";
import React, { useContext, useEffect, useState,useCallback } from "react";
import { MessageContext, handleErrorMessage, } from "../../store/messageStore";
import Pagination from "../../components/Pagintaion";
import Loading from "../../components/Loading";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  const [, dispatch] = useContext(MessageContext);


  // 使用 useCallback 包裝 getOrders
  const getOrders = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/orders?page=${page}`);
      setOrders(res.data.orders);
      setPagination(res.data.pagination);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      handleErrorMessage(dispatch, error); // 假設 handleErrorMessage 和 dispatch 也需要
    }
  }, [dispatch]); // 如果 handleErrorMessage 依賴於 dispatch

  // 確保 useEffect 使用穩定的 getOrders 函數
  useEffect(() => {
    getOrders(); // 這裡的 getOrders 是穩定的，不會每次渲染時都改變
  }, [getOrders]);
  return (
    <>
      <Loading isLoading={isLoading} />
      <h3>訂單列表</h3>
      <hr />
      <table className='table'>
        <thead>
          <tr className="text-center">
            <th scope='col'>訂單編號</th>
            <th scope='col'>總金額</th>
            <th scope='col'>訂購日期</th>
            <th scope='col'>付款狀態</th>
            <th scope='col'></th>

          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            return (
              <tr className="text-center" key={order.id}>
                <td className="align-middle">{order.id}</td>
                <td className="align-middle">
                  NT$ {order.total}
                </td>
                <td className="align-middle">{new Date(order.create_at * 1000).toLocaleDateString()}</td>
                <td className="align-middle">
                  <p className={`${order.is_paid ? 'bg-success' : 'bg-danger'} rounded fw-bold text-white py-1 mt-3`}>{order.is_paid ? '已付款' : '未付款'}</p>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="d-flex justify-content-center">
        <Pagination pagination={pagination} changePage={getOrders} />
      </div>
    </>
  )
}

export default AdminOrders