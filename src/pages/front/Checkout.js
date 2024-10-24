import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { SelectBox, Input } from '../../components/FormElements';
import { Textarea } from '../../components/FormElements';
import Stepper from "../../components/Stepper";
import axios from 'axios';

function Checkout() {
  const navigate = useNavigate();
  const {  getCart } = useOutletContext();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });



  const onSubmit = async (data) => {
    const { name, email, tel, address ,receipt} = data
    const form = {
      data: {
        user: {
          name,
          email,
          tel,
          address,
          receipt
        },

      }
    }
    try{
      const res = await axios.post(`/v2/api/${process.env.REACT_APP_API_PATH}/order`, form);
      await getCart();
      navigate(`/success/${res.data.orderId}`)
    }catch(error){
      console.log(error);
    }
   
  };
 
  return (

    <div className='container container-fluid-md'>
      {/* <Loading isLoading={isLoading} /> */}
      <div className='row justify-content-center'>
        <div className='col-12 col-md-10 col-lg-8' >
          <Stepper data={[
            { step: 1, content: '商品確認', done: true },
            { step: 2, content: '付款資訊', done: true },
            { step: 3, content: '訂單完成', done: false },
          ]}></Stepper>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h4 className='text-white tablePadding bg-primary mb-0' style={{ borderTopLeftRadius: '30px', borderTopRightRadius: '30px' }}>顧客資訊</h4>
            <div className="tablePadding checkout-border">
              <div className='my-3'>
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

              <div className='my-3'>
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
              <div className='my-3'>
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
              <div className='my-3'>
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
              <div className='my-3'>
                <div className='form-group my-3'>
                  <Textarea
                    id='comment'
                    type='text'
                    errors={errors}
                    labelText='備註事項'
                    register={register}
                    placeholder='請輸入備註事項'
                  >
                  </Textarea>
                </div>
              </div>
              <div className='my-3'>
                <h4>發票資訊</h4>
                <div className="row">
                  <SelectBox
                    id="receipt"
                    control={control}
                    data={[
                      { label: '電子發票', value: 'electronic_invoice' },
                      { label: '紙本發票', value: 'paper_invoice' },
                      { label: '電子捐贈', value: 'electronic_donation' },
                    ]}
                    placeholder="請選擇發票類型"
                    rules={{
                      required: {
                        value: true,
                        message: '請選擇發票',
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            <div className='d-flex  mt-6 justify-content-center mb-7'>
              <Link className='mt-md-0  ' to='/cart'>
                <button className='btn btn-outline-secondary  btn-item-1'>
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