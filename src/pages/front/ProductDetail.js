import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext, useParams } from "react-router";
import { useDispatch, useSelector } from 'react-redux';
import {
  Link,
} from 'react-router-dom';
import { createAsyncMessage, } from "../../slice/messageSlice";

import { addFavorite, removeFavorite } from '../../slice/favoritesSlice';
import ProductsCard from "../../components/ProductsCard";
import Loading from "../../components/Loading";
function ProductDetail() {
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { id } = useParams();
  const [cartQuantity, setCartQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const { getCart, cartData } = useOutletContext();
  const dispatch = useDispatch();
  const [mainImage, setMainImage] = useState();
  const [toggler, setToggler] = useState(false);
  const [tempImages, setTempImages] = useState([]);
  const favorites = useSelector(state => state.favorites || []);

  const isFavorite = favorites.some(fav => fav.id === id);



  useEffect(() => {
    const fetchData = async () => {
      await getCart(); // 確保我們獲取到購物車資料
  
      const getProducts = async () => {
        try {
          const productsRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/product/${id}`);
          setProduct(productsRes.data.product);
          setMainImage(productsRes.data.product.imageUrl);
          setTempImages([productsRes.data.product.imageUrl]);
  
          if (productsRes.data.product.imagesUrl) {
            setTempImages([
              productsRes.data.product.imageUrl,
              ...productsRes.data.product.imagesUrl
            ]);
          }
  
          // 獲取相關產品
          fetchRelatedProducts(productsRes.data.product.category);
        } catch (error) {
          dispatch(createAsyncMessage(error.response.data));
        }
      };
  
      // 獲取相關產品的函數
      const fetchRelatedProducts = async (category) => {
        try {
          setIsLoading(true);
          const relatedRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products`, {
            params: { category }
          });
          // 過濾掉當前產品並取前4個相關產品
          setRelatedProducts(relatedRes.data.products.filter(item => item.id !== id).slice(0, 4));
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          dispatch(createAsyncMessage(error.response.data));
        }
      };
  
      // 调用獲取產品數據的函數
      await getProducts();
      console.log(cartData); // 確保在這裡打印的是最新的 cartData
    };
  
    fetchData(); // 調用獲取數據的函數
  }, [id, dispatch, getCart]); // 注意依賴項的設置

  const handleSizeSelect = (size) => {
    setSelectedSize(size); // 更新用戶選擇的尺寸
  };
  const handleColorSelect = (color) => {
    setSelectedColor(color)
    // 這裡可以進行顏色選擇的處理
  };
  
  const addToCart = async () => {
    if (selectedSize && selectedColor) {
      const newVariantId = `${selectedColor}-${selectedSize}`;
      const newVariant = {
        id: newVariantId,
        color: selectedColor,
        size: selectedSize,
        num: cartQuantity,
      };

      // 確保 cartData 是一個陣列，然後執行查找
      const existingCartItem = Array.isArray(cartData.carts) 
      ? cartData.carts.find(item => item.product_id === product.id) 
      : null;
      let updatedVariants = [];

      if (existingCartItem) {
        const existingVariant = existingCartItem.variants.find(variant => variant.id === newVariantId);

        if (existingVariant) {
          // 如果變體已存在，則增加數量
          updatedVariants = existingCartItem.variants.map(variant =>
            variant.id === newVariantId
              ? { ...variant, num: variant.num + cartQuantity} // 更新數量
              : variant
          );
        } else {
         
          updatedVariants = [
            ...existingCartItem.variants,
            newVariant
          ];
        }
      } else {
        updatedVariants = [newVariant];
      }

      const cartItemData = {
        product_id: product.id,
        qty: cartQuantity,
        variants: updatedVariants,
      };

      try {
        const res = await axios.post(
          `/v2/api/${process.env.REACT_APP_API_PATH}/cart`,
          { data: cartItemData }
        );
        dispatch(createAsyncMessage(res.data))
        getCart();
      } catch (error) {
        console.error("添加至購物車時出錯:", error.response.data);
      }
    } else {
      alert('請選擇尺寸和顏色');
    }
  };
  const changeMainImage = (image) => {
    setMainImage(image);
  }

  const handleAddFavorite = () => {
    if (product) {
      if (favorites.some(fav => fav.id === product.id)) {
        dispatch(removeFavorite(product));
        dispatch(createAsyncMessage({ success: true, message: "成功移除我的最爱" }));

      } else {
        dispatch(addFavorite(product));
        dispatch(createAsyncMessage({ success: true, message: "新增我的最爱" }));
      }
    }
  };
  return (
    <>
      <div className="container-lg">
        <Loading isLoading={isLoading} />
        <div className="row justify-content-between mt-6">
          <div className="product-detail col-md-6 p-0 col-sm-12 order-md-1 order-sm-1 order-1  m-0">

            <div
              onClick={() => setToggler(!toggler)}>
              <img className="bg-light p-0 w-100" src={mainImage} alt="商品圖片" style={{ objectFit: "cover", borderRadius: "10px" }} />
            </div>
            <div className="d-flex text-nowrap overflow-hidden mt-3">
              {tempImages?.map((img, i) => {
                return (
                  <div className="m-1" key={i} style={{ width: "120px", height: "120px", border: "2px solid #ddd", borderRadius: "10px" }}>
                    <img
                      src={img}
                      alt="產品其他圖片"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      onClick={() => changeMainImage(img)}
                    />
                  </div>
                );
              })}

            </div>
          </div>
          <div className="col-md-6 col-sm-12 order-sm-3 order-md-2 order-3 px-4">
            <nav aria-label='breadcrumb'>
              <ul className='breadcrumb'>
                <li className='breadcrumb-item'>
                  <Link
                    to='/products/all'
                    className='link'
                    aria-label='All Products'
                  >
                    <small>所有商品</small>
                  </Link>
                </li>
                <li className='breadcrumb-item active' aria-current='page'>
                  <Link
                    to={`/products/${product.category}`}
                    className='link'

                  >
                    <small>{product.category}</small>
                  </Link>
                </li>
              </ul>
            </nav>
            <h2 className="mb-0 fs-4">{product.title}</h2>
            <div className="d-flex justify-content-between align-items-center">
              <p className="fs-4 text-end" style={{ color: '#DE0000' }}>NT$ {product.price}</p>
              <p className="text-decoration-line-through">NT${product.origin_price}</p>
            </div>
            <p>{product.content}</p>
            <hr />
            <h2 className="fs-4">商品描述</h2>
            <p style={{ whiteSpace: "pre-line" }} className="mb-5">{product.description}</p>
            {/* 顏色選擇 */}
            <div className="d-flex align-items-center">
              <p className="me-3 mb-0">顏色</p>
              <button
                className={`color-button btn me-3 ${selectedColor === '藍色' ? 'selected' : ''}`}
                style={{ backgroundColor: "blue" }}
                onClick={() => handleColorSelect("藍色")}
              ></button>
              <button
                className={`color-button me-3 ${selectedColor === '綠色' ? 'selected' : ''}`}
                style={{ backgroundColor: "green" }}
                onClick={() => handleColorSelect("綠色")}
              ></button>
              <button
                className={`color-button me-3 ${selectedColor === '黑色' ? 'selected' : ''}`}
                style={{ backgroundColor: "black" }}
                onClick={() => handleColorSelect("黑色")}
              ></button>
            </div>


            <div className="d-flex align-items-baseline mt-5">
              <p className="me-3 p-0">尺寸</p>
              <button
                className={`size-button me-3 ${selectedSize === 'M' ? 'selected' : ''}`}
                onClick={() => handleSizeSelect("M")}
              >M</button>
              <button
                className={`size-button me-3 ${selectedSize === 'L' ? 'selected' : ''}`}
                onClick={() => handleSizeSelect("L")}
              >L</button>
              <button
                className={`size-button me-3 ${selectedSize === 'XL' ? 'selected' : ''}`}
                onClick={() => handleSizeSelect("XL")}
              >XL</button>
            </div>

            <div className="row align-items-center">
              <div className="col-4">
                <div className="input-group my-3 flex-nowrap amount-input-max-width">
                  <button
                    type="button"
                    className="btn btn-outline-secondary py-2"
                    onClick={() => setCartQuantity((pre) => (pre === 1 ? pre : pre - 1))}>
                    <i className="bi bi-dash-lg"></i>
                    </button>
                  <input
                    type="text"
                    className="form-control border-1 border-light text-center bg-light amount-input-min-width"
                    aria-label="input amount"
                    value={cartQuantity}
                    readOnly
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary py-2"
                    onClick={() => setCartQuantity((pre) => pre + 1)}>

                    <i className="bi bi-plus-lg"></i>
                    </button>
                </div>
              </div>
              <div className="col-4">
                <button type="button" disabled={isLoading} onClick={addToCart} className="btn text-light btn-primary " style={{ height: "42px", borderRadius: "10px" }}>
                  加入購物車
                </button>
              </div>
            </div>
            <div className="d-flex align-items-center">

              <button className="btn"
                onClick={handleAddFavorite}
                style={{
                  color: isFavorite ? '#AD8F7E' : '#AD8F7E',
                }}
              >
                {isFavorite ? <i className="bi bi-heart-fill" style={{ fontSize: "24px" }}></i> : <i className="bi bi-heart" style={{ fontSize: "24px" }}></i>}
              </button><i className="bi bi-share text-primary ms-3" style={{ fontSize: '24px' }}></i>

            </div>
          </div>
        </div>
        <h3 className="mt-6">相關產品</h3>
        <div className="row mb-7">
          {relatedProducts.map((relatedProduct) => (
            <div className="col-lg-3 col-md-4 col-sm-6 " key={relatedProduct.id}>
              <Link to={`/product/${relatedProduct.id}`}
                style={{ textDecoration: 'none' }}
              >
                <ProductsCard product={relatedProduct} ></ProductsCard>
              </Link>
            </div>
          ))}
        </div>
      </div >
    </>)
}

export default ProductDetail;