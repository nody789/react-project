import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import Stepper from "../../components/Stepper";
function Success() {
    const { orderId } = useParams();
    const [orderData, setOrderData] = useState({});
    const { getCart } = useOutletContext();
    const getOrderCart = async (orderId) => {
        const res = await axios.get(
            `/v2/api/${process.env.REACT_APP_API_PATH}/order/${orderId}`

        )
        console.log(res)
        setOrderData(res.data.order);
        getCart();
    }
    useEffect(() => {
        getOrderCart(orderId)
        console.log('買家訊息', orderId, orderData)
    }, [orderId])
    return (
        <div className='container'>
            <div className='row  justify-content-center '>
                <div className='col-12 col-md-8'>
                    <Stepper data={[
                        { step: 1, content: '商品確認', done: true },
                        { step: 2, content: '付款資訊', done: true },
                        { step: 3, content: '訂單完成', done: true },
                    ]}></Stepper>

                    {/* <Link to='/' className='btn btn-outline-dark me-2 rounded-0 mb-4'>
                            回到首頁
                        </Link> */}

                    <div className="bg-primary tablePadding table-responsive" style={{ borderRadius: "30px" }}>
                        <table className='table table-primary table-borderless m-0' style={{minWidth:"500px"}}>
                            <thead className="border-white thead-border">
                                <tr>
                                    <td className="text-white" >購物清單</td>
                                </tr>
                            </thead>
                            <tbody className="border-white align-middle">
                                {Object.values(orderData?.products || {}).map((item) => {
                                    return (
                                        <tr key={item.id} >
                                            <td> <img
                                                src={item.product.imageUrl}
                                                alt=''
                                                className='cart-img'                                          
                                            /></td>
                                            <td className="text-white">{item.product.title}</td>
                                            <td className="text-white">{item.color}</td>
                                            <td className="text-white">{item.size}</td>
                                            <td className="text-white">{item.qty}</td>
                                            <td className="text-white">{item.final_total}</td>
                                        </tr>

                                    )
                                })}
                                {/* <tr>
                                    <td colspan="4"></td>
                                    <td class="text-right text-white" >運費</td>
                                    <td class="text-right text-white">$60</td>
                                </tr>
                                <tr>
                                    <td colspan="4"></td>
                                    <td class="text-right text-white">總計</td>
                                    <td class="text-right text-white">NT${orderData.total}</td>
                                </tr> */}
                            </tbody>
                        </table>
                        <div className=' mt-3 text-white d-flex justify-content-between'>
                            <p className='mb-0  fw-bold'>折價</p>
                            <p className='mb-0  fw-bold'>0</p>
                        </div>
                        <div className=' mt-3 text-white d-flex justify-content-between'>
                            <p className='mb-0  fw-bold'>總計</p>
                            <p className='mb-0  fw-bold'>NT${orderData.total}</p>
                        </div>
                    </div>
                    <div className="bg-primary text-white mt-6 tablePadding" style={{ borderRadius: "30px" }}>
                        <h5 className="h5">顧客資訊</h5>
                        <hr className="new1" />
                        <div>
                            <p>{orderData?.user?.name}</p>
                            <p>{orderData?.user?.tel}</p>
                            <p>{orderData?.user?.address}</p>
                            <h5 className="h5">備註事項</h5>
                            <p className="pb-5">{orderData?.user?.comment}</p>
                        </div>
                    </div>
                    <div className="bg-primary tablePadding text-white  my-6" style={{ borderRadius: "30px" }}>
                        <h5 className="h5">購物須知</h5>
                        <hr className="new1" />
                        <p>鑑賞期時間依據消費者保護法之規定，是由消費者完成簽收取件的隔日開始算起至第7天止。7天鑑賞期內方能申請退貨(取件或管理員簽收的隔日開始算起至第7天止，例如：管理員簽收的時間是12/20，其七天鑑賞期起訖日為12/21~12/27，12/28即無法申請退貨)。</p>

                    </div>
                    <div className="d-flex justify-content-center mb-7">
                        <Link
                            to='/'
                            className='btn btn-primary btn-item  py-3 text-white'
                            style={{ width: "184px" }}
                        >
                            回首頁
                        </Link>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default Success;