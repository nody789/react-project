import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";

//createAsyncThunk 建立非同步
export const messageSlice = createSlice({
    name: 'message',
    initialState: [],
    reducers: {
        createMessage(state, action) {
           if(action.payload.success){
               state.push({
                   id:action.payload.id,
                   type: 'success',
                   title: '成功',
                   text: action.payload.message,
               });

           }else{
            state.push({
                id:action.payload.id,
                type: 'danger',
                title: '錯誤',
                text:Array.isArray(action.payload?.message)
                  //把陣列改成字串形式中間補上頓好
                 ? action.payload.message.join('、')
                //   //如果沒有的話直接把這個值回傳
                 : action.payload.message,
            });
           }

            // const item={
            //     type:'success',
            //     title:'成功',
            //     text:action.payload.message,
            // }
            // state.push(item)
            //可以寫成這樣
            // setTimeout(()=>{
            //     //state 沒辦法在非同步狀態下存取
            //     //檢查陣列的id如果item的id等於當前這個id 把品項移除
            // const index = state.findIndex(item=>item===id);
            // state.splice(index,1)
            // },2000)
        },
        removeMessage(state,action){
            //這樣才是同步 加上setTimeout是非同步
            console.log('remove:',action.payload)
            const index = state.findIndex(item=>item===action.payload);
            state.splice(index,1)
        }
    }
});

//這裡建立的方法 可以被其他元件使用
//createAsyncThunk 帶入兩個參數 一個是自定義名稱 第二個Async function  
export const createAsyncMessage = createAsyncThunk(
'message/createAsyncMessage',
async function(payload,{dispatch,requestId}){
    //非同步方式  用dispatch來觸發上方
    // console.log('createAsyncMessage',payload,params)
    dispatch(messageSlice.actions.createMessage({
        ...payload,
        id:requestId,
    }),
    );
    setTimeout(()=>{
        dispatch(messageSlice.actions.removeMessage(requestId));
    },3000)

});
export const { createMessage } = messageSlice.actions;
export default messageSlice.reducer;