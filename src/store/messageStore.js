import { createContext } from "react"; 

export const MessageContext =  createContext({});
export const initState = {
    type:'',
    title:'',
    message:'', 
}

export const messageReducer = (state,action)=>{
    switch (action.type) {
        case "POST_MESSAGE":
            return{
                ...action.payload
            }
        case "CLEAR_MESSAGE":
            return{
            ...initState,
            }
    
        default:
         return state
    }
}
export function handleSuccessMessage(dispatch, res) {
    dispatch({
      type: "POST_MESSAGE",
      payload: {
        type: "success",
        title: '更新成功',
        text: res.data.message,
      }
    });
    setTimeout(()=>{
        dispatch({
            type:"CLEAR_MESSAGE",
        });
    },3000)
  }
  export function handleErrorMessage(dispatch, error) {
    dispatch({
      type: "POST_MESSAGE",
      payload: {
        type: "danger",
        title: '失敗',
        //isArray來判斷訊息是不適陣列格式 
        text: Array.isArray(error?.response?.data?.message)
          //把陣列改成字串形式中間補上頓好
          ? error?.response?.data?.message.join('、')
          //如果沒有的話直接把這個值回傳
          : error?.response?.data?.message,
      }
    });
    setTimeout(()=>{
        dispatch({
            type:"CLEAR_MESSAGE"
        })
    },3000)
  }