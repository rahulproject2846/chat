import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { userLogin } from "../store/actions/authAction";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { SUCCESS_MESSAGE_CLEAR, ERROR_CLEAR } from "../store/types/authType";
import useSound from 'use-sound';
import loginSound from '../audio/login.mp3';


const Login = ({ history }) => {


    const [loginSPlay] = useSound(loginSound);
    const alert = useAlert();
    const { loading, successMessage, error, authenticate, myInfo } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [state, setState] = useState({
        email: '',
        password: ''
    });

    const inputHendle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const login = (e) => {

        e.preventDefault();
        dispatch(userLogin(state));
        loginSPlay();

    }

    useEffect(() => {
        if (authenticate) {
            history.push('/')
        }
        if (successMessage) {
            alert.success(successMessage);
            dispatch({ type: SUCCESS_MESSAGE_CLEAR })
        }
        if (error) {
            error.map(err => alert.error(err));
            dispatch({ type: ERROR_CLEAR })
        }
    }, [successMessage, error])

    return (
        <div className="login">
            <div className="card">
                <div className="card-header">
                    <h3>Login</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={login}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input onChange={inputHendle} value={state.email} type="email" placeholder="email" name="email" id="email" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input onChange={inputHendle} value={state.password} type="password" name="password" id="password" placeholder="password" className="form-control" />
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Login" className="btn" />
                        </div>
                        <div className="form-group">
                            <span><Link to="/MESSENGER/Register">Register Your Account</Link></span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )

}
export default Login