import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import axios from "axios";
import { useOutletContext } from "react-router";
import Loading from "../../components/Loading";

import { removeFavorite } from '../../slice/favoritesSlice';
import { createAsyncMessage, } from "../../slice/messageSlice";

function Favorite() {
    const dispatch = useDispatch();
    const favorites = useSelector(state => state.favorites);
    const [isLoading, setIsLoading] = useState(false);
    const { getCart } = useOutletContext();


    const handleRemoveFavorite = (product) => {
            dispatch(removeFavorite(product));
            dispatch(createAsyncMessage({ success: true, message: '已移除我的最愛' }));
    };
    const addTocart = async (product) => {

        const data = {
            data: {
                product_id: product.id,
                qty: 1,

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
            dispatch(removeFavorite(product));

        } catch (error) {
            console.log(error);
            setIsLoading(false);
            dispatch(createAsyncMessage(error.response.data));
        }

    }
    return (
        <>

            <div className="container">
            <Loading isLoading={isLoading} />


                        {favorites.length === 0 ? (
                            <p>沒有收藏的商品。</p>
                        ) : (

                            <div className="table-responsive">
                                <table className="table align-middle" style={{minWidth:"768px"}}>
                                    <thead>
                                        <tr>
                                            <th colSpan={2}>我的最愛資訊</th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th colSpan={2} className="text-center">
                                                <button className="btn btn-none p-0">
                                                    清除所有追蹤
                                                </button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {favorites?.map((product) => (
                                            <tr key={product.id}>
                                                <td>
                                                    <div className="cart-img-container">
                                                        <Link to={`/products/${product.id}`}>
                                                            <img
                                                                src={product.imageUrl}
                                                                alt={product.title}
                                                                style={{ width: `100px`, height: `94px` }}
                                                                title="查看商品詳情"
                                                            />
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex justify-content-center align-items-start flex-column">
                                                        <span>{product.title}</span>
                                                        <span className="text-muted fs-7">1{product.unit}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex justify-content-center align-items-start flex-column">
                                                        <span className="text-muted fs-7 text-decoration-line-through">
                                                            NT{product.origin_price}
                                                        </span>
                                                        <span className="text-primary fs-7 fw-bolder">NT{product.price}</span>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <button
                                                        className="btn btn-primary  text-white"
                                                        title="加入購物車"
                                                        onClick={() => addTocart(product)}
                                                        disabled={product.id === isLoading}
                                                    >
                                                       
                                                            <span>加入購物車</span>
                                                    
                                                    </button>
                                                </td>
                                                <td className="text-center">
                                                    <Link
                                                        to={`/product/${product.id}`}
                                                        title="查看商品詳情"
                                                    >
                                                        查看商品詳情
                                                    </Link>
                                                </td>

                                                <td>
                                                    <div className="d-flex justify-content-center align-items-center">
                                                        <button
                                                            type="button"
                                                            className="btn  btn-none d-flex justify-content-center align-items-center py-2"
                                                            onClick={() => handleRemoveFavorite(product)}
                                                            title="移除追蹤"
                                                        >
                                                            <i className="bi bi-trash3 text-primary"></i>

                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>


                        )}


                    </div>
         
      

        </>
    )

}

export default Favorite;