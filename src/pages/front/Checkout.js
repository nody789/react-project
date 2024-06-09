import { Link, useOutletContext, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from "react-hook-form";
import { CheckboxRadio, Input } from '../../components/FormElements';
import { Textarea } from '../../components/FormElements';
import Stepper from "../../components/Stepper";

import axios from 'axios';

function Checkout() {
  const { cartData } = useOutletContext();

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });



  const onSubmit = async (data) => {
    const { name, email, tel, address } = data
    const form = {
      data: {
        user: {
          name,
          email,
          tel,
          address
        },
        // message: "這是留言"
        // -Nv0i0pbMlZbxU4hwOzs
      }
    }
    // console.log(errors);
    // console.log(data);
    const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/order`, form);
    console.log(res);
    navigate(`/success/${res.data.orderId}`)
  };
  return (

      <div className='container p-0'>
        <div className='row justify-content-center flex-md-row flex-column-reverse'>
          <div className='col-md-8 ' >
            <Stepper data={[
              { step: 1, content: '商品確認', done: true },
              { step: 2, content: '付款資訊', done: true },
              { step: 3, content: '訂單完成', done: false },
            ]}></Stepper>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='bg-primary text-white tablePadding' style={{ borderRadius: "30px" }}>
                {/* style={{width:"794px",margin:"auto"}} */}
                <h4 className='fw-bold'>顧客資訊</h4>
                <div className='mb-2 '>
                  <Input
                    id='name'
                    type='text'
                    errors={errors}
                    labelText='姓名'
                    register={register}
                    rules={{
                      required: '姓名為必填',
                      maxLength: {
                        value: 10,
                        message: '姓名長度不超過 10',
                      },
                    }}
                  ></Input>
                </div>

                <div className='mb-2 '>
                  <Input
                    id='email'
                    labelText='Email'
                    type='email'
                    errors={errors}
                    register={register}
                    rules={{
                      required: 'Email 為必填',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Email 格式不正確',
                      },
                    }}
                  ></Input>
                </div>
                <div className='mb-2'>
                  <Input
                    id='tel'
                    labelText='電話'
                    type='tel'
                    errors={errors}
                    register={register}
                    rules={{
                      required: '電話為必填',
                      minLength: {
                        value: 6,
                        message: '電話不少於 6 碼'
                      },
                      maxLength: {
                        value: 12,
                        message: '電話不超過 12 碼'
                      }
                    }}
                  ></Input>
                </div>
                <div className='mb-5'>
                  <Input
                    id='address'
                    labelText='地址'
                    type='address'
                    errors={errors}
                    register={register}
                    rules={{
                      required: '地址為必填',
                    }}
                  ></Input>
                </div>
                <div className='mb-2'>
                  <Textarea register={register} labelText="備註事項"
                    id="comment"
                    rows="5"

                  >
                  </Textarea>
                </div>
                <div className='mb-2'>
                  <h4>發票資訊</h4>
                  <hr className='new1' />
                  <div className='d-flex  justify-content-between'>
                    <CheckboxRadio style={{width: "143px",height: "49px"}} type="radio"
                      register={register}
                      errors={errors}
                      name="isInvoice"
                      id="electronic-invoice"
                      value={true}
                      rules={{ required: '請選擇發票' }}
                      labelText="電子發票" />
                    <CheckboxRadio
                      type="radio"
                      register={register}
                      errors={errors}
                      name="isInvoice"
                      id="paper-invoice"
                      value={false}
                      rules={{
                        required: '請選擇發票'
                      }}
                      labelText="紙本發票" />
                    <CheckboxRadio
                      type="radio"
                      register={register}
                      errors={errors}
                      name="isInvoice"
                      id="donate-invoice"
                      value={false}
                      rules={{
                        required: '請選擇發票'
                      }}
                      labelText="發票捐贈" />
                     
                  </div>
                </div>

              </div>
              <div className='d-flex  mt-6 justify-content-center mb-7'>
                <Link className='mt-md-0  ' to='/cart'>
                 <button className='text-white btn btn-primary btn-item-1'>
                回上一頁
                 </button>
                </Link>
                <button
                  type='submit'
                  className='btn text-white ms-3 btn-primary  btn-item-1'
                >
                  確認送出
                </button>
              </div>
            </form>

          </div>
          {/* <div className='col-md-4'>
            <div className='border p-4 mb-4'>
              <h4 className='mb-4'>選購餐點</h4>
              {cartData?.carts?.map((item) => {
                return (
                  <div className='d-flex' key={item.id}>
                    <img
                      src={item.product.imageUrl}
                      alt=''
                      className='me-2'
                      style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                    />
                    <div className='w-100'>
                      <div className='d-flex justify-content-between fw-bold'>
                        <p className='mb-0'>{item.product.title}</p>
                        <p className='mb-0'>x{item.qty}</p>
                      </div>
                      <div className='d-flex justify-content-between'>
                        <p className='text-muted mb-0'>
                          <small>NT$ {item.product.price}</small>
                        </p>
                        <p className='mb-0'>NT$ {item.final_total}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div className='d-flex justify-content-between mt-4'>
                <p className='mb-0 h4 fw-bold'>Total</p>
                <p className='mb-0 h4 fw-bold'>NT$ {cartData.final_total}</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
  );
}

export default Checkout;