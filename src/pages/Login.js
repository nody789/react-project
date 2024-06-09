import axios from "axios";
import { useState } from "react";
import {useNavigate} from "react-router-dom";

function Login() {
  const navigate = useNavigate();
    const [data,setData]=useState({
        username:'',
        password:''
    });
    const [loginState,setLoginState]= useState({});
    const handleChange = (e)=>{
     const {name,value} = e.target;
     //解構 把原始的值待進來 新的值則是name跟value的值
     setData({...data,[name]:value});
    }
    const submit = async(e)=>{
      try {
        //後面戴上夾帶的資料
    const res = await axios.post(`/v2/admin/signin`,data)
    //除了儲存token還要儲存expired
    const {token,expired} =res.data;
    console.log(res);

     //第一個片段是token要存的值名字可以自己命名 第二個他的到期日
     //儲存token
      document.cookie = `nody852Token=${token}; expires = ${new Date(expired)}`
      //判斷登入
      if(res.data.success){
       navigate('/admin/products')
      }
      } catch (error) {
        setLoginState(error.response.data);
      }
    
    }
    return (<div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>登入帳號</h2>
  
          <div className={`alert alert-danger ${loginState.message ? 'd-block': 'd-none'}`} role="alert">
           {loginState.message}
          </div>
          <div className="mb-2">
            <label htmlFor="email" className="form-label w-100">
              Email
              <input id="email" className="form-control" name="username" type="email" placeholder="Email Address"
              onChange={handleChange}/>
            </label>
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="form-label w-100">
              密碼
              <input type="password" className="form-control"  name="password" id="password" placeholder="name@example.com"
              onChange={handleChange} />
            </label>
          </div>
          <button type="button" className="btn btn-primary" onClick={submit}>登入</button>
        </div>
      </div>
    </div>)
  }
  
  export default Login;