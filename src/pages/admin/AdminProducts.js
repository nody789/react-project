import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch,} from 'react-redux';
import { createAsyncMessage, } from "../../slice/messageSlice";
import ProductModal from "../../components/ProductModal";
import DeleteModal from "../../components/DeleteModal";
import { Modal } from "bootstrap";
import Pagination from "../../components/Pagintaion";
import Loading from "../../components/Loading";



function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  //type 決定modal展開的用途
  const [type, setType] = useState('create');//edit
  const [tempProduct, setTempProduct] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const productModal = useRef(null);
  const deleteModal = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    productModal.current = new Modal('#productModal', { backdrop: 'static' });
    deleteModal.current = new Modal('#deleteModal', { backdrop: 'static' });
    getProducts();
  }, [])
  const getProducts = async (page = 1) => {
    try {
      setIsLoading(true)
      const productRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/products?page=${page}`)
      setProducts(productRes.data.products);
      setPagination(productRes.data.pagination);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }
  const openProductModal = (type, product) => {
    setType(type);
    setTempProduct(product);
    productModal.current.show();
  }
  const closeProductModal = () => {
    productModal.current.hide();
  }
  const openDeleteModal = (product) => {
    setTempProduct(product);
    deleteModal.current.show();
  }
  const closeDeleteModal = () => {
    deleteModal.current.hide();
  }
  const deleteProduct = async (id) => {
    try {
      const res = await axios.delete(`/v2/api/${process.env.REACT_APP_API_PATH}/admin/product/${id}`);
      if (res.data.success) {
        getProducts();
        deleteModal.current.hide();
        dispatch(createAsyncMessage(res.data.message));
      }
    } catch (error) {
      dispatch(createAsyncMessage(error));
    }
  }
  return (
    <>
      <div>
        <Loading isLoading={isLoading} />
        <ProductModal closeProductModal={closeProductModal} getProducts={getProducts}
          type={type} tempProduct={tempProduct} />
        <DeleteModal close={closeDeleteModal} text={tempProduct.title} handleDelete={deleteProduct} id={tempProduct.id} />
        <div className="p-3">
          <h3>產品列表</h3>
          <hr />
          <div className="text-end">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => openProductModal('create', {})}
            >
              建立新商品
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">分類</th>
                <th scope="col">名稱</th>
                <th scope="col">售價</th>
                <th scope="col">啟用狀態</th>
                <th scope="col">編輯</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                return (
                  <tr key={product.id}>
                    <td>{product.category}</td>
                    <td>{product.title}</td>
                    <td>{product.price}</td>
                    <td>{product.is_enabled ? '啟用' : '未啟用'}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => openProductModal('edit', product)}
                      >
                        編輯
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm ms-2"
                        onClick={() => openDeleteModal(product)}
                      >
                        刪除
                      </button>
                    </td>
                  </tr>
                )
              })}

            </tbody>
          </table>
          <Pagination pagination={pagination} changePage={getProducts} />
        </div>
      </div>
    </>
  )
}
export default AdminProducts;