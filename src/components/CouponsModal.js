import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch,} from 'react-redux';
import { createAsyncMessage, } from "../slice/messageSlice";

function CouponsModal({ closeModal, getCoupons, type, tempCoupons }) {
  const dispatch = useDispatch();

  const [tempData, setTempData] = useState({
    title: "",
    is_enabled: 1,
    percent: 80,
    due_date: 1555459200,
    code: "testCode"
  });
  //在儲存時間的時候要先儲存這個格式 用於後面轉換
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    //用type 來判斷新增還是編輯
    if (type === 'create') {
      setTempData({
        title: "",
        is_enabled: 1,
        percent: 80,
        due_date: 1555459200,
        code: "testCode"
      });
      //預設今天日期
      setDate(new Date());
    } else if (type === 'edit') {
      setTempData(tempCoupons);
      setDate(new Date(tempCoupons.due_date))
    }
  }, [type, tempCoupons])
  const handleChange = (e) => {
  
    const { value, name } = e.target
    //includes 查詢的值
    if (['price', 'origin_price'].includes(name)) {
      setTempData({
        //包含原始值
        ...tempData,
        [name]: Number(value),
      })
    } else if (name === 'is_enabled') {
      setTempData({
        //包含原始值
        ...tempData,
        [name]: +e.target.checked,//
      })
    } else {
      setTempData({
        //包含原始值
        ...tempData,
        [name]: value,
      })

    }
  }
  const submit = async () => {
    try {
      let api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon`;
      let method = 'post'
      if (type === 'edit') {
        api = `/v2/api/${process.env.REACT_APP_API_PATH}/admin/coupon/${tempCoupons.id}`
        method = 'put';
      }
      const res = await axios[method](api, {
        data: {
          ...tempData,
          due_date: date.getTime(),//轉換成unix timestamp
        }
      });
      closeModal();
      getCoupons();
      dispatch(createAsyncMessage(res.data));
    } catch (error) {
      dispatch(createAsyncMessage(error.response.data));
    }
  }

  return (
    <div
      className='modal fade'
      id='productModal'
      tabIndex='-1'
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-lg'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h1 className='modal-title fs-5' id='exampleModalLabel'>
              {type === 'create' ? '建立新優惠卷' : `編輯${tempData.title}`}
            </h1>
            <button type='button' className='btn-close' aria-label='Close' onClick={closeModal} />
          </div>
          <div className='modal-body'>
            <div className='mb-2'>
              <label className='w-100' htmlFor='title'>
                標題
                <input
                  type='text'
                  id='title'
                  placeholder='請輸入標題'
                  name='title'
                  className='form-control mt-1'
                  onChange={handleChange}
                  value={tempData.title}
                />
              </label>
            </div>
            <div className='row'>
              <div className='col-md-6 mb-2'>
                <label className='w-100' htmlFor='percent'>
                  折扣（%）
                  <input
                    type='text'
                    name='percent'
                    id='percent'
                    placeholder='請輸入折扣（%）'
                    className='form-control mt-1'
                    value={tempData.percent}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className='col-md-6 mb-2'>
                <label className='w-100' htmlFor='due_date'>
                  到期日
                  <input
                    type='date'
                    id='due_date'
                    name='due_date'
                    placeholder='請輸入到期日'
                    className='form-control mt-1'
                    //把時間格式轉成字串
                    value={`${date.getFullYear().toString()}-${(
                      //在把月轉成字串
                      date.getMonth() + 1
                    )
                      .toString()
                      .padStart(2, 0)}-${date
                        //在把時間轉換成給轉換出來把它取出來轉換成字串
                        .getDate()
                        .toString()
                        .padStart(2, 0)}`}
                    onChange={(e) => {
                      setDate(new Date(e.target.value))
                    }}
                  />
                </label>
              </div>
              <div className='col-md-6 mb-2'>
                <label className='w-100' htmlFor='code'>
                  優惠碼
                  <input
                    type='text'
                    id='code'
                    name='code'
                    placeholder='請輸入優惠碼'
                    className='form-control mt-1'
                    value={tempData.code}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </div>
            <label className='form-check-label' htmlFor='is_enabled'>
              <input
                className='form-check-input me-2'
                type='checkbox'
                id='is_enabled'
                name='is_enabled'
                onChange={handleChange}
                //要轉成Boolean(tempData.is_enabled) 前面加個!
                checked={!!tempData.is_enabled}
              />
              是否啟用
            </label>
          </div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-secondary' onClick={closeModal}>
              關閉
            </button>
            <button type='button' className='btn btn-primary' onClick={submit}>
              儲存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CouponsModal;