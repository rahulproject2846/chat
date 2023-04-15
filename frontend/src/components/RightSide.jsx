import React from 'react'
import { IoMdArrowRoundBack, BsCameraVideoFill, IoCall } from 'react-icons/all'
import FriendInfo from './FriendInfo'
import Message from './Message'
import MessageSend from './MessageSend'

const RightSide = (props) => {
    const {
        currentfriend,
        inputHendle,
        newMessage,
        sendMessage,
        message,
        scrollRef,
        emojiSend,
        ImageSend,
        activeUser,
        typingMessage,
    } = props;

    return (
        <div className='col-9'>
            <div className="right-side">
                <input type="checkbox" id='dot' />
                <div className="row">
                    <div className="col-8">
                        <div className="message-send-show">
                        <div className="header">
                                <label className="backBtn" htmlFor="friendCheckbox">
                                    <div className="backIcon">
                                        <IoMdArrowRoundBack />
                                    </div>
                                    
                                </label>
                                <label htmlFor="dot">
                                    <div className="image-name">
                                        <div className="image">
                                            <img src={currentfriend.image} alt="" />
                                            {
                                                activeUser && activeUser.length > 0 && activeUser.some(u => u.userId === currentfriend._id) ?
                                                    <div className="active-icon"></div> : ''
                                            }
                                        </div>
                                        <div className="name">
                                            <h3> {currentfriend.userName} </h3>
                                            <span>{
                                                activeUser && activeUser.length > 0 && activeUser.some(u => u.userId === currentfriend._id) ? 'Active now' : 'Offline'}
                                            </span>
                                        </div>
                                    </div>
                                </label>
                                <div className="icons">
                                    <div className="icon hide">
                                        <IoCall />
                                    </div>
                                    <div className="icon hide">
                                        <BsCameraVideoFill />
                                    </div>
                                    <div className="icon">
                                        <label htmlFor="dot">
                                            <div className="hamburger">
                                                <div className="menu">
                                                    <div className="bar1"></div>
                                                    <div className="bar2"></div>
                                                    <div className="bar3"></div>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <Message
                                currentfriend={currentfriend}
                                scrollRef={scrollRef}
                                message={message}
                                typingMessage={typingMessage}
                            />
                            <MessageSend
                                ImageSend={ImageSend}
                                emojiSend={emojiSend}
                                sendMessage={sendMessage}
                                inputHendle={inputHendle}
                                newMessage={newMessage}
                                typingMessage={typingMessage}
                            />
                        </div>
                    </div>
                    <div className="col-4">
                        <FriendInfo message={message} currentfriend={currentfriend} activeUser={activeUser} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RightSide