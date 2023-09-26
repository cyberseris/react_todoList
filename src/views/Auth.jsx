import { Outlet } from 'react-router-dom'
import authTitle from '../assets/authTitle.png';
import authCover from '../assets/authCover.png';


const Auth = () => {
    return (
        <div>
            <div id="signUpPage" className="bg-yellow">
                <div className="conatiner signUpPage vhContainer d-flex">
                    <div className="side">
                        <a href="#"><img className="logoImg" src={authTitle} alt="" /></a>
                        <img className="d-m-n" src={authCover} alt="workImg" />
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Auth