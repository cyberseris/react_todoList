import { useState } from "react";
import axios from 'axios';
import { useNavigate, NavLink } from "react-router-dom";
const { VITE_APP_HOST } = import.meta.env;

const Login = () => {
    console.log(VITE_APP_HOST);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);


    function HandleChange(e) {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const HandleSignIn = async (e) => {
        // post 路徑, 資料, headers
        // get  路徑, headers
        e.preventDefault();

        setIsLoading(true);
        const res = await axios.post(`${VITE_APP_HOST}/users/sign_in`, formData);
        console.log('test');
        console.log(res);

        const { token } = res.data;
        document.cookie = `token=${token};`
        {/* 避免用戶不斷地點擊 */ }
        setIsLoading(false);

        navigate('/todo');
    }

    return (
        <div>
            {/*onSubmit={HandleSignUp}*/}

            <form className="formControls" onSubmit={HandleSignIn}>

                <h2 className="formControls_txt">最實用的線上代辦事項服務</h2>
                <label className="formControls_label" htmlFor="email">Email</label>
                <input className="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" value={formData.email} onChange={HandleChange} required />

                <label className="formControls_label" htmlFor="password">密碼</label>
                <input className="formControls_input" type="password" id="password" name="password" placeholder="請輸入密碼" value={formData.password} onChange={HandleChange} required />

                <input className="formControls_btnSubmit" type="submit" value="登入" />

                <NavLink to="/auth/sign_up" className="formControls_btnLink">註冊帳號</NavLink>
            </form>
        </div>
    )
}

export default Login;