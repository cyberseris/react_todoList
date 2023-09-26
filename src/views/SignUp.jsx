import { useState } from 'react'
import axios from 'axios'
import { useNavigate, NavLink } from 'react-router-dom';

const { VITE_APP_HOST } = import.meta.env;
const SignUp = () => {
    console.log(VITE_APP_HOST);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nickname: ''
    })

    const navigate = useNavigate();

    function HandleChange(e) {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const HandleSignUp = async (e) => {
        // post 路徑, 資料, headers
        // get  路徑, headers
        e.preventDefault();

        try {
            const res = await axios.post(`${VITE_APP_HOST}/users/sign_up`, formData)
            console.log(res);
            navigate('/auth/login')
        } catch (error) {
            alert(error.response.data.message)
        }
    }

    return (
        <div>
            <form className="formControls" onSubmit={HandleSignUp}>
                <h2 className="formControls_txt">註冊帳號</h2>
                <label className="formControls_label" htmlFor="email">Email</label>
                <input className="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" value={formData.email} onChange={HandleChange} required />
                <label className="formControls_label" htmlFor="nickname">您的暱稱</label>
                <input className="formControls_input" type="text" name="nickname" id="nickname" placeholder="請輸入您的暱稱" value={formData.nickname} onChange={HandleChange} required />
                <label className="formControls_label" htmlFor="password">密碼</label>
                <input className="formControls_input" type="password" name="password" id="password" placeholder="請輸入密碼" value={formData.password} onChange={HandleChange} required />
                <label className="formControls_label" htmlFor="password">再次輸入密碼</label>
                <input className="formControls_input" type="password" name="password" id="password" placeholder="請再次輸入密碼" value={formData.password} onChange={HandleChange} required />
                <input className="formControls_btnSubmit" type="submit" value="註冊帳號" />
                <NavLink to="/auth/login" className="formControls_btnLink">登入</NavLink>
            </form>

        </div>
    )
}

export default SignUp;