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
    const { getCart } = useOutletContext();
    const dispatch = useDispatch();
    const [mainImage, setMainImage] = useState();
    const [toggler, setToggler] = useState(false);
    const [tempImages, setTempImages] = useState([]);
    const favorites = useSelector(state => state.favorites || []);

    const isFavorite = favorites.some(fav => fav.id === id);

    const getProducts = async (id) => {
        const productsRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/product/${id}`);
        console.log(productsRes)
        //產品列表
        setProduct(productsRes.data.product);
        setMainImage(productsRes.data.product.imageUrl);
        setTempImages([productsRes.data.product.imageUrl])
        if (productsRes.data.product.imagesUrl) {
            setTempImages([
                productsRes.data.product.imageUrl,
                ...productsRes.data.product.imagesUrl
            ])

        }
        fetchRelatedProducts(productsRes.data.product.category);

    }
    const fetchRelatedProducts = async (category) => {
        try {
            setIsLoading(true);
            const relatedRes = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products`, {
                params: { category }
            });
            setRelatedProducts(relatedRes.data.products.filter(item => item.id !== id).slice(0, 4));
            setIsLoading(false);

        } catch (error) {
            setIsLoading(false);
            dispatch(createAsyncMessage(error.response.data));
        }
    };
    const handleSizeSelect = (size) => {
        setSelectedSize(size); // 更新用戶選擇的尺寸
    };
    const handleColorSelect = (color) => {
        setSelectedColor(color)
    }

    const addTocart = async () => {
        if (selectedSize) {
            const data = {
                data: {
                    product_id: product.id,
                    qty: cartQuantity,
                    size: selectedSize,
                    color: selectedColor,
                }
            }
            setIsLoading(true);
            try {
                const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/cart`, data)
                console.log(res);
                //用dispatch 來觸發createAsyncMessage
                dispatch(createAsyncMessage(res.data))
                getCart();
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
                dispatch(createAsyncMessage(error.response.data));
            }
        } else {
            alert('請選擇尺寸和顏色')
        }

    }
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
    useEffect(() => {
        getProducts(id);
    }, [id])
    return (
        <>
            <div className="container-lg">
                <Loading isLoading={isLoading} />

                <div className="row justify-content-between mt-6">
                    <div className="col-sm-12 col-md-2 order-md-0 order-sm-2 order-2">
                        <div className="product-detail-img">
                            {tempImages?.map((img, i) => (
                                <div className="mb-3 left-img-container " key={i}>
                                    <img
                                        src={img}
                                        alt="產品其他圖片"
                                        className="left-img "
                                        onClick={() => changeMainImage(img)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="product-detail col-md-6 p-0 col-sm-12 order-md-1 order-sm-1 order-1  m-0">

                        <div
                            onClick={() => setToggler(!toggler)}>
                            <img className="bg-light p-0 w-100" src={mainImage} alt="商品圖片" style={{ objectFit: 'cover' }} />
                        </div>


                    </div>
                    <div className="col-md-4 col-sm-12 order-sm-3 order-md-2 order-3 ">
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
                        <p style={{ whiteSpace: "pre-line" }}>{product.description}</p>
                        <div className="d-flex">

                            <select defaultValue className="form-select bg-primary text-light btn-item" aria-label="Default select example" onChange={(e) => handleColorSelect(e.target.value)}>
                                <option value={'color'}>請選擇顏色</option>
                                <option value="藍色">藍色</option>
                                <option value="綠色">綠色</option>
                                <option value="黑色">黑色</option>
                            </select>
                            <select defaultValue className="form-select bg-primary text-light btn-item" aria-label="Default select example" onChange={(e) => handleSizeSelect(e.target.value)}>
                                <option value={'size'}>尺寸</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                            </select>
                        </div>

                        <div className="input-group border bg-primary btn-item mb-3   mt-3">
                            <div className="input-group-prepend">
                                <button type="button" className="btn  border-0 text-light py-3"
                                    onClick={() => setCartQuantity((pre) => pre === 1 ? pre : pre - 1)}
                                ><i className="bi bi-dash-lg"></i></button>
                            </div>
                            <input type="number" className="form-control bg-primary  border-0 text-center  shadow-none text-light"
                                value={cartQuantity}
                                readOnly />
                            <div className="input-group-append">
                                <button type="button" className="btn  border-0 text-light py-3"
                                    onClick={() => {
                                        setCartQuantity((pre) => pre + 1)
                                    }}
                                ><i className="bi bi-plus-lg"></i></button>
                            </div>
                        </div>
                        <button type="button" disabled={isLoading} onClick={() => addTocart()} className="btn text-light btn-primary  w-100 btn-item py-3">加入購物車</button>
                        <div className="d-flex mt-3">

                            <button className="btn"
                                onClick={handleAddFavorite}
                                style={{
                                    color: isFavorite ? '#AD8F7E' : '#AD8F7E',
                                }}
                            >
                                {isFavorite ? <i className="bi bi-heart-fill" style={{ fontSize: "48px" }}></i> : <i className="bi bi-heart" style={{ fontSize: "48px" }}></i>}
                            </button>                            <i className="bi bi-share text-primary ms-3" style={{ fontSize: '48px' }}></i>

                        </div>
                    </div>
                </div>
                <h3 className="mt-6">相關產品</h3>
                <div className="row">
                    {relatedProducts.map((relatedProduct) => (
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={relatedProduct.id}>
                            <Link to={`/product/${relatedProduct.id}` }
                                style={{ textDecoration: 'none' }}
                               
                            >
                                <ProductsCard product={relatedProduct} ></ProductsCard>
                                
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>)
}

export default ProductDetail;