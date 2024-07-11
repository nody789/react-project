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
      
      }
    }

    const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/order`, form);
    console.log(res);
    navigate(`/success/${res.data.orderId}`)
  };
  return (

      <div className='container container-fluid-md'>
        <div className='row justify-content-center'>
          <div className='col-md-8 col-12' >
            <Stepper data={[
              { step: 1, content: '商品確認', done: true },
              { step: 2, content: '付款資訊', done: true },
              { step: 3, content: '訂單完成', done: false },
            ]}></Stepper>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='bg-primary text-white tablePadding' style={{ borderRadius: "30px" }}>
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
                  <div className="row">
                  <div className="col d-flex justify-content-between">
                    <CheckboxRadio type="radio"
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
         
        </div>
      </div>
  );
}

export default Checkout;