import { Route, Routes, NavLink } from 'react-router-dom'
import Auth from './views/Auth';
import SignUp from './views/SignUp';
import Login from './views/Login';
import Todo from './views/Todo';
import NotFound from './views/NotFound';
import './App.css'

function App() {
  return (
    <>

      <Routes>
        {/* 路由表 */}

        {/* /auth */}
        {/* /auth/sign_up */}
        {/* /auth/sign_in */}

        <Route path="/auth" element={<Auth />} >
          {/* 內層可以省略斜線 */}
          <Route path="sign_up" element={<SignUp />} />
          <Route path="login" element={<Login />} />
        </Route>

        <Route path='/todo' element={<Todo />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
