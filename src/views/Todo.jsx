import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import jwt_decode from "jwt-decode";

const { VITE_APP_HOST } = import.meta.env;

const todoData = []

/* 
const todoData = [{
    id: 1,
    text: "把冰箱發霉的檸檬拿去丟",
    isCompleted: false,
    checkedStatus: false,
}, {
    id: 2,
    text: "打電話叫媽媽匯款給我",
    isCompleted: false,
    checkedStatus: false,
}, {
    id: 3,
    text: "整理電腦資料夾",
    isCompleted: false,
    checkedStatus: false,
}, {
    id: 4,
    text: "繳電費水費瓦斯費",
    isCompleted: false,
    checkedStatus: false,
}
] */

const TodoList = () => {
    const [todos, setTodos] = useState(todoData);
    const [newTodo, setNewTodo] = useState('');
    const [nickname, setNickname] = useState('');
    const [checkedItems, setCheckedItems] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [todoStatus, setTodoStatus] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        // 取得 Cookie
        const cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith("token="))
            ?.split("=")[1];

        const decodedToken = jwt_decode(cookieValue);
        setNickname(decodedToken.nickname);

        // 預設 axios 的表頭
        axios.defaults.headers.common['Authorization'] = cookieValue;

        // 驗證登入
        axios.get(`${VITE_APP_HOST}/users/checkout`).then(() => {
            console.log("驗證成功")
            setIsLoggedIn(true)
        }).catch(err => {
            console.log('登入失敗啦', err);
            setTimeout(() => {
                navigate('/auth/login')
            }, 3000);
        })

    }, [navigate, nickname])


    const toggleCheck = (id) => {
        const newTodos = todos.map((todo) => {
            if (todo.id === id) {
                return {
                    ...todo,
                    isCompleted: !todo.isCompleted,
                    checkedStatus: !todo.checkedStatus,
                };
            }
            return todo;
        });
        setTodos(newTodos);

        if (checkedItems.includes(id)) {
            setCheckedItems(checkedItems.filter((item) => item !== id));
        } else {
            setCheckedItems([...checkedItems, id]);
        }
    }

    const clearCheckedItems = () => {
        const updatedTodos = todos.filter((todo) => !checkedItems.includes(todo.id));
        setTodos(updatedTodos);

        setCheckedItems([]);

    }

    const HandleTodoStatus = (status) => {
        setTodoStatus(status)

        if (status === "all") {
            setTodos(todoData);

            const updatedTodos = todos.map((todo) => ({
                ...todo,
                isCompleted: checkedItems.includes(todo.id),
            }));
            setTodos(updatedTodos);
        }

    }

    const addTodo = (text) => {
        const newTodos = [
            ...todos,
            {
                id: Math.floor(Math.random() * 10000),
                text,
                isCompleted: false,
            },
        ];
        setTodos(newTodos);
    }

    const removeTodo = (id) => {
        const newTodos = [...todos];
        const filteredTodos = newTodos.filter((todo) =>
            todo.id !== id ? todo : null
        );
        if (checkedItems.includes(id)) {
            setCheckedItems(checkedItems.filter((item) => item !== id));
        }

        setTodos(filteredTodos);
    }

    const signOut = async () => {

        try {
            const cookieValue = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            const res = await axios.post(
                `${VITE_APP_HOST}/users/sign_out`, {}, {
                headers: {
                    Authorization: cookieValue,
                },
            });

            document.cookie = "todo_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            axios.defaults.headers.common['Authorization'] = "";

            navigate("/auth/login");

            console.log("登出成功");
        } catch (error) {
            console.log("登出失敗", error.message);
        }
    }

    /* useEffect(() => {
        console.log(todos);
    }, [todos]); */

    return (
        <div>
            {isLoggedIn ? (
                <div id="todoListPage" className="bg-half">
                    <nav>
                        <h1><a href="#">ONLINE TODO LIST</a></h1>
                        <ul>
                            <li className="todo_sm"><span>{nickname}</span></li>
                            <li><a className="btn bg-yellow border-0 ms-24" onClick={() => signOut()}>登出</a></li>
                        </ul>
                    </nav>
                    <div className="conatiner todoListPage vhContainer">
                        <div className="todoList_Content">
                            <div className="inputBox">
                                <input type="text" placeholder="請輸入待辦事項" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
                                <a href="#" className='text-white' onClick={(e) => {
                                    e.preventDefault();
                                    addTodo(newTodo);
                                }}>
                                    <i className="fa fa-plus"></i>
                                </a>
                            </div>

                            <div className="todoList_list">
                                <ul className="todoList_tab p-0">
                                    <li><a onClick={() => HandleTodoStatus("all")} className={todoStatus === "all" ? 'active' : ''}>全部</a></li>
                                    <li><a onClick={() => HandleTodoStatus("completed")} className={todoStatus === "completed" ? 'active' : ''}>已完成</a></li>
                                    <li><a onClick={() => HandleTodoStatus("inCompleted")} className={todoStatus === "inCompleted" ? 'active' : ''}>未完成
                                    </a></li>
                                </ul>

                                <div className="todoList_items">
                                    <ul className="todoList_item p-0">
                                        {todos.length === 0
                                            && <li className="todoList_label" style={{ justifyContent: 'space-around' }}>
                                                目前尚無待辦事項
                                            </li>
                                        }
                                        {todos
                                            .filter((todo) => todoStatus === "all"
                                                ? true : todoStatus === "completed"
                                                    ? todo.isCompleted
                                                    : !todo.isCompleted)

                                            .map((todo) => (
                                                <li key={todo.id} className="d-flex align-items-center">
                                                    <label className="todoList_label">
                                                        <input className="todoList_input" type="checkbox" value="true" onChange={() => toggleCheck(todo.id)} checked={todo.checkedStatus} />
                                                        <span style={{ textDecoration: todo.isCompleted ? "line-through" : "" }}>{todo.text}</span>
                                                    </label>
                                                    <a href="#" className="d-flex align-items-center">
                                                        <button type="button" className="border-0" onClick={
                                                            (e) => {
                                                                e.preventDefault();
                                                                removeTodo(todo.id)
                                                            }}><i className="fa fa-times"></i></button>
                                                    </a>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                    <div className="todoList_statistics">
                                        <p> {todos.length - checkedItems.length}個待完成項目</p>
                                        <a href="#" onClick={
                                            (e) => {
                                                e.preventDefault();
                                                clearCheckedItems();
                                            }
                                        }>清除已完成項目</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            ) : (
                <p>登入失敗，請先登入</p>
            )}

        </div>
    )
}

export default TodoList;