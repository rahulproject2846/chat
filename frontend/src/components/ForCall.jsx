import React from 'react'
import moment from 'moment';
import { FiPhoneIncoming, FiPhoneOutgoing, FiPhoneMissed, SiGooglemessages } from "react-icons/all";
const ForCall = ({ currentfriend }) => {
    return (
        <div className="call-friend">
            <span className='recents'> Recents </span>
            <label htmlFor="/"> {/* friendCheckbox */}
                <div className="image-call-icon">
                    <div className="image">
                        <img src={currentfriend.image} alt="" />
                    </div>
                </div>
                <div className="call-detils-conversation">
                    <div className="call-detils">
                        <h4>{currentfriend.userName}</h4>
                        <div className="call-time">
                            <span> <FiPhoneIncoming /> Incoming. </span>
                            <span> {moment(currentfriend.createdAt).startOf('mini').fromNow()} </span>
                        </div>
                    </div>
                    <div className="conversation"><SiGooglemessages /></div>
                </div>
            </label>
            <label htmlFor="/"> {/* friendCheckbox */}
                <div className="image-call-icon">
                    <div className="image">
                        <img src={currentfriend.image} alt="" />
                    </div>
                </div>
                <div className="call-detils-conversation">
                    <div className="call-detils">
                        <h4>{currentfriend.userName}</h4>
                        <div className="call-time">
                            <span> <FiPhoneOutgoing /> Outgoing. </span>
                            <span> {moment(currentfriend.createdAt).startOf('mini').fromNow()} </span>
                        </div>
                    </div>
                    <div className="conversation"><SiGooglemessages /></div>
                </div>
            </label>
            <label htmlFor="/"> {/* friendCheckbox */}
                <div className="image-call-icon">
                    <div className="image">
                        <img src={currentfriend.image} alt="" />
                    </div>
                </div>
                <div className="call-detils-conversation">
                    <div className="call-detils">
                        <h4>{currentfriend.userName}</h4>
                        <div className="call-time">
                            <span className='missed'> <FiPhoneMissed /> Missed. </span>
                            <span> {moment(currentfriend.createdAt).startOf('mini').fromNow()} </span>
                        </div>
                    </div>
                    <div className="conversation"><SiGooglemessages /></div>
                </div>
            </label>
        </div>
    )
}

export default ForCall