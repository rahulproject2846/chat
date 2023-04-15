import React, { useEffect, useState, useRef } from 'react'
import { BiSearch, IoLogOutOutline, CgColorBucket, BsFillPeopleFill, BsFillChatFill, BsFillCameraVideoFill } from "react-icons/all";
import Friends from './Friends';
import RightSide from './RightSide';
import { io } from "socket.io-client";
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { getFriends, messageSend, getMessage, ImageMessageSend, seenMessage, updateMessage, getTheme, themeSet } from "../store/actions/messengerAction";
import { userLogout } from "../store/actions/authAction";
import useSound from 'use-sound';
import notificationSound from '../audio/notification.mp3';
import sendingSound from '../audio/sending.mp3';
import logoutSound from '../audio/logout.mp3';
import ActiveFriend from './ActiveFriend';
import ForCall from './ForCall';

const Messenger = () => {
    const [notificationSPlay] = useSound(notificationSound);
    const [sendingSPlay] = useSound(sendingSound);
    const [logoutSPlay] = useSound(logoutSound);
    const { myInfo } = useSelector(state => state.auth);
    const { friends, message, messageSendSuccess, message_get_success, themeMood, new_user_add } = useSelector(state => state.messenger);
    const [currentfriend, setCurrentFriend] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [socketMessage, setSocketMessage] = useState('');
    const [typingMessage, setTypingMessage] = useState('')
    const [activeUser, setActiveUser] = useState([]);
    const scrollRef = useRef();
    const socket = useRef();

    useEffect(() => {
        socket.current = io('/');
        socket.current.on('getMessage', (data) => {
            setSocketMessage(data);
        })
        socket.current.on('typingMessageGet', (data) => {
            setTypingMessage(data);
        })
        socket.current.on('msgSeenResponse', msg => {
            dispatch({
                type: 'SEEN_MESSAGE',
                payload: {
                    msgInfo: msg
                }
            })
        })
        socket.current.on('msgDelivaredResponse', msg => {
            dispatch({
                type: 'DELIVARED_MESSAGE',
                payload: {
                    msgInfo: msg
                }
            })
        })
        socket.current.on('seenSuccess', data => {
            dispatch({
                type: 'SEEN_ALL',
                payload: data
            })
        })
    }, []);
    useEffect(() => {
        socket.current.emit('addUser', myInfo.id, myInfo)
    }, []);
    useEffect(() => {
        socket.current.on('getUser', (users) => {
            const filterUser = users.filter(u => u.userId !== myInfo.id);
            setActiveUser(filterUser);
        });
        socket.current.on('new_user_add', data => {
            dispatch({
                type: 'NEW_USER_ADD',
                payload: {
                    new_user_add: data
                }
            })
        })
    }, [])
    useEffect(() => {
        if (socketMessage && currentfriend) {
            if (socketMessage.senderId === currentfriend._id && socketMessage.reseverId === myInfo.id) {
                dispatch({
                    type: 'SOCKET_MESSAGE',
                    payload: {
                        message: socketMessage
                    }
                })
                dispatch(seenMessage(socketMessage));
                socket.current.emit('messageSeen', socketMessage);
                dispatch({
                    type: 'UPDATE_FRIEND_MESSAGE',
                    payload: {
                        msgInfo: socketMessage,
                        status: 'seen'
                    }
                })
            }
        }
        setSocketMessage('')
    }, [socketMessage])
    useEffect(() => {
        if (socketMessage && socketMessage.senderId !== currentfriend._id && socketMessage.reseverId === myInfo.id) {
            notificationSPlay();
            toast.success(`${socketMessage.senderName} send a new message`)
            dispatch(updateMessage(socketMessage));
            socket.current.emit('delivaredMessage', socketMessage);
            dispatch({
                type: 'UPDATE_FRIEND_MESSAGE',
                payload: {
                    msgInfo: socketMessage,
                    status: 'delivared'
                }
            })
        }
    }, [socketMessage])
    const inputHendle = (e) => {
        setNewMessage(e.target.value);
        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            reseverId: currentfriend._id,
            msg: e.target.value
        })
    }
    const sendMessage = (e) => {
        e.preventDefault();
        sendingSPlay();
        const data = {
            senderName: myInfo.userName,
            reseverId: currentfriend._id,
            message: newMessage ? newMessage : '👍'
        }
        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            reseverId: currentfriend._id,
            msg: ''
        })
        dispatch(messageSend(data));
        setNewMessage('')
    }
    const emojiSend = (emu) => {
        setNewMessage(`${newMessage}` + emu);
        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            reseverId: currentfriend._id,
            msg: emu
        })
    }
    const ImageSend = (e) => {
        if (e.target.files.length !== 0) {
            sendingSPlay();
            const formData = new FormData();
            formData.append('senderName', myInfo.userName);
            formData.append('reseverId', currentfriend._id);
            formData.append('image', e.target.files[0]);
            dispatch(ImageMessageSend(formData));
        }
    }
    const dispatch = useDispatch();
    useEffect(() => {
        if (messageSendSuccess) {
            socket.current.emit('sendMessage', message[message.length - 1]);
            dispatch({
                type: 'UPDATE_FRIEND_MESSAGE',
                payload: {
                    msgInfo: message[message.length - 1]
                }
            })
            dispatch({ type: 'MESSAGE_SEND_SUCCESS_CLEAR' })
        }
    }, [messageSendSuccess])
    useEffect(() => {
        dispatch(getFriends());
        dispatch({ type: 'NEW_USER_ADD_CLEAR' })
    }, [new_user_add]);

    // useEffect(() => {
    //     if (friends && friends.length > 0) {
    //         setCurrentFriend(friends[0].fndInfo);
    //     }
    // }, [friends])

    useEffect(() => {
        dispatch(getMessage(currentfriend._id));
    }, [currentfriend?._id])
    useEffect(() => {
        if (message.length > 0) {
            if (message[message.length - 1].senderId !== myInfo.id && message[message.length - 1].status !== 'seen') {
                dispatch({
                    type: 'UPDATE',
                    payload: {
                        id: currentfriend._id
                    }
                })
                socket.current.emit('seen', { senderId: currentfriend._id, reseverId: myInfo.id });
                dispatch(seenMessage({ _id: message[message.length - 1]._id }))
            }
        }
        dispatch({
            type: 'MESSAGE_GET_SUCCESS_CLEAR'
        })
    }, [message_get_success])
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [message]);
    const [hide, setHide] = useState(true);
    const logout = () => {
        dispatch(userLogout());
        socket.current.emit('logout', myInfo.id);
        logoutSPlay();
    }
    useEffect(() => {
        dispatch(getTheme());
    }, []);
    const search = (e) => {
        const getFriendClass = document.getElementsByClassName('hover-friend');
        const frienNameClass = document.getElementsByClassName('Fd_name');
        for (var i = 0; i < getFriendClass.length, i < frienNameClass.length; i++) {
            let text = frienNameClass[i].innerText.toLowerCase();
            if (text.indexOf(e.target.value.toLowerCase()) > -1) {
                getFriendClass[i].style.display = '';
            } else {
                getFriendClass[i].style.display = 'none';
            }
        }
    }

    return (
        <div className={themeMood === 'dark' ? 'messenger themeDark' : themeMood === 'black' ? 'messenger themeBlack' : 'messenger'}>
            <Toaster
                position={'top-right'}
                reverseOrder={false}
                toastOptions={{
                    style: {
                        fontSize: '18px'
                    }
                }}
            />
            <input type="checkbox" id='friendCheckbox' />
            <input type="radio" className="tab-toggle" name="tab-toggle" id="tab1" defaultChecked />
            <input type="radio" className="tab-toggle" name="tab-toggle" id="tab2" />
            <input type="radio" className="tab-toggle" name="tab-toggle" id="tab3" />

            <div className="row">
                <div className="col-3">
                    <div className="left-side">
                        <input type="checkbox" id='showMyInfo' />
                        <div className="MyInfo">
                            <div className="image">
                                <img src={myInfo.image} alt="" />
                            </div>
                            <div className="myDetils">
                                <p> {myInfo.userName}</p>
                                <p> {myInfo.email.slice(0, 20)}</p>
                            </div>
                        </div>
                        <div className="top">
                            <label htmlFor="showMyInfo">
                                <div className="chats">
                                    <div className="icons">
                                        <div className="icon">
                                            <div className="menu">
                                                <div className="bar1"></div>
                                                <div className="bar2"></div>
                                                <div className="bar3"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="image-name">
                                    <div className="image">
                                        <img src={myInfo.image} alt="" />
                                    </div>
                                    <div className="name">
                                        <h3>{myInfo.userName}</h3>
                                    </div>
                                    <span className='chat-list'> Chats </span>
                                    <span className='call-list'> Calls </span>
                                    <span className='active-list'> People </span>
                                </div>
                            </label>
                            <div className="icons">
                                <div className="iconTwo">
                                    <div onClick={() => setHide(!hide)} className="hamburger">
                                        <CgColorBucket />
                                    </div>
                                </div>
                                <div className="iconThree">
                                    <div onClick={logout} className="logout">
                                        <IoLogOutOutline />
                                        <div className="logoutHover">
                                            Logout
                                        </div>
                                    </div>
                                </div>
                                <div className={hide ? 'theme_logout' : 'theme_logout show'}>
                                    <div className="theme_logout_body">
                                        <h3>Theme</h3>
                                        <div className="dark">
                                            <label htmlFor="dark"> Dark </label>
                                            <input onChange={(e) => dispatch(themeSet(e.target.value))} value='dark' type="radio" name='theme' id='dark' />
                                        </div>
                                        <div className="black">
                                            <label htmlFor="black"> Black </label>
                                            <input onChange={(e) => dispatch(themeSet(e.target.value))} value='black' type="radio" name='theme' id='black' />
                                        </div>
                                        <div className="light">
                                            <label htmlFor="light"> Light </label>
                                            <input onChange={(e) => dispatch(themeSet(e.target.value))} value='light' type="radio" name='theme' id='light' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="forCallTab">
                            <div className="tabOne">
                                <div className="friends">
                                    <div className="friend-search">
                                        <div className="search">
                                            <button><BiSearch /></button>
                                            <input onChange={search} type="text" placeholder='search' className="form-control" />
                                        </div>
                                    </div>
                                    {
                                        activeUser && activeUser.length > 0 ? <div className="active-friends">
                                            {
                                                activeUser.map((u, i) => <ActiveFriend key={i} setCurrentFriend={setCurrentFriend} user={u} />)
                                            }
                                        </div> : ''}
                                    {
                                        friends && friends.length > 0 ? friends.map((fd, index) => <div key={index} onClick={() => setCurrentFriend(fd.fndInfo)} className={currentfriend._id === fd.fndInfo._id ? 'hover-friend active' : 'hover-friend'}>
                                            <Friends activeUser={activeUser} myId={myInfo.id} friend={fd} />
                                        </div>) : <div className="firstViewFriends">No friend yet ... </div>
                                    }
                                </div>
                            </div>
                            <div className="tabTwo">
                                {
                                    <ForCall
                                        currentfriend={currentfriend}
                                    />
                                }
                            </div>
                            <div className="tabThree">
                                <span className='active-text'> Active now </span>
                                <div className="friends">
                                    {
                                        activeUser && activeUser.length > 0 ? <div>
                                            {
                                                activeUser && activeUser.length > 0 ? <div className="active-friends">
                                                    {
                                                        activeUser.map((u, i) => <ActiveFriend key={i} setCurrentFriend={setCurrentFriend} user={u} />)
                                                    }
                                                </div> : ''}
                                        </div> : <div className="NoActiveFriend">No active friend  ... </div>
                                    }
                                </div>
                            </div>

                        </div>
                        <div className="proparty">
                            <label className="tab-trigger-one" htmlFor="tab1"><BsFillChatFill /><p>Chats</p></label>

                            <label className="tab-trigger-two" htmlFor="tab2"><BsFillCameraVideoFill /><p>Calls</p></label>

                            <label className="tab-trigger" htmlFor="tab3"><BsFillPeopleFill /><p>People</p></label>
                        </div>

                    </div>
                </div>
                {
                    currentfriend ? <RightSide
                        activeUser={activeUser}
                        ImageSend={ImageSend}
                        currentfriend={currentfriend}
                        inputHendle={inputHendle}
                        newMessage={newMessage}
                        sendMessage={sendMessage}
                        message={message}
                        scrollRef={scrollRef}
                        emojiSend={emojiSend}
                        typingMessage={typingMessage}
                    /> : friends && friends.length > 0 ? <div className="firstView">Select a chat to start messaging</div> : <div className="firstViewFriend">No friend yet ... </div>
                }
            </div>
        </div>
    )
}

export default Messenger