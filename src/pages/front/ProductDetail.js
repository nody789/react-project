import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext, useParams } from "react-router";
import { useDispatch } from 'react-redux';
import {
    // useNavigate,
    // useOutletContext,
    // useParams,
    Link,
} from 'react-router-dom';
import { createAsyncMessage } from "../../slice/messageSlice";
import imgBackground from "../../assets/236948485_167549795462865_3827562595937853525_n 1.png";
import 'react-lazy-load-image-component/src/effects/blur.css';
function ProductDetail() {
    const [product, setProduct] = useState({});
    const { id } = useParams();
    const [cartQuantity, setCartQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const { getCart } = useOutletContext();
    const dispatch = useDispatch();
    // const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [mainImage, setMainImage] = useState();
    const [toggler, setToggler] = useState(false);
    const [tempImages, setTempImages] = useState([]);



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
    }
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
    useEffect(() => {
        getProducts(id);
    }, [id])
    return (
        <>
            <div className="container">
                <div className="row justify-content-between mt-6">
                    <div className=" product-detail col-lg-2">
                        <div className="text-end">
                            {tempImages?.map((img, i) => {
                                return (
                                    <div className="mb-3 " key={i} >
                                        <img src={img} alt="產品其他圖片"
                                            style={{ width: '183px', height: '183px', objectFit: 'cover', borderRadius: '100%', }}
                                            onClick={() => changeMainImage(img)}
                                        />
                                    </div>

                                )
                            })}

                        </div>
                    </div>
                    <div className="product-detail col-lg-6 p-0  m-0">
                        <div
                            onClick={() => setToggler(!toggler)}>
                            <img className="bg-light p-0 w-100" src={mainImage} alt="商品圖片" style={{ height: '590px', width: '590px', objectFit: 'cover' }} />
                        </div>


                    </div>
                    <div className="col-md-4">
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
                        <div className="d-flex justify-content-between">
                            <p className="fs-4 text-end" style={{ color: '#DE0000' }}>NT$ {product.price}</p>
                            <p className="text-decoration-line-through">NT${product.origin_price}</p>
                        </div>
                         <p>{product.content}</p>
                        <hr />
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
                        {/* <div className="input-group mb-3   mt-3">
                            <div className="input-group-prepend" >
                                <button onClick={() => setCartQuantity((pre) =>
                                    pre === 1 ? pre : pre - 1)} className="btn btn-primary text-light py-3" type="button" id="button-addon1">
                                    <i className="bi bi-dash"></i>
                                </button>
                            </div>
                            <input type="number" value={cartQuantity} readOnly className="form-control  text-light bg-primary border-0 text-center  shadow-none" placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1" />
                            <div className="input-group-append">
                                <button onClick={() => setCartQuantity((pre) =>
                                    pre + 1)}
                                    className="btn btn-primary text-light py-3" type="button" id="button-addon2">
                                    <i className="bi bi-plus"></i>
                                </button>
                            </div>
                        </div> */}
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
                            <i className="bi bi-heart text-primary" style={{ fontSize: '48px' }}></i>
                            <i className="bi bi-share text-primary ms-3" style={{ fontSize: '48px' }}></i>

                        </div>
                    </div>
                </div>
                <div >
                    <img className="d-block mt-6 object-fit-cover mx-auto w-100 mb-7 "
                        src={imgBackground} alt="" />
                </div>
            </div>
        </>)
}

export default ProductDetail;