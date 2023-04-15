import React from 'react'
import { BsChevronDown, BiSearch } from 'react-icons/all'
import moment from 'moment';

const FriendInfo = ({ currentfriend, activeUser, message }) => {

    const search = (e) => {
        const getFriendClass = document.getElementsByClassName('my-message');
        const frienNameClass = document.getElementsByClassName('my-text');
        for (var i = 0; i < getFriendClass.length, i < frienNameClass.length; i++) {
            let text = frienNameClass[i].innerText.toLowerCase();
            if (text.indexOf(e.target.value.toLowerCase()) > -1) {
                getFriendClass[i].style.display = '';
            } else {
                getFriendClass[i].style.display = 'none';
            }
        }
        const getFriendClassw = document.getElementsByClassName('fd-message');
        const frienNameClassw = document.getElementsByClassName('fd-text');
        for (i = 0; i < getFriendClassw.length, i < frienNameClassw.length; i++) {
            let text = frienNameClassw[i].innerText.toLowerCase();
            if (text.indexOf(e.target.value.toLowerCase()) > -1) {
                getFriendClassw[i].style.display = '';
            } else {
                getFriendClassw[i].style.display = 'none';
            }
        }
    }

    return (
        <div className='friend-info'>
            <input type="checkbox" id='gallery' />
            <div className="image-name">
                <div className="image">
                    <img src={currentfriend.image} alt="" />
                </div>
                <div className="name">
                    <h4>{currentfriend.userName}</h4>
                </div>
                {
                    activeUser && activeUser.length > 0 && activeUser.some(u => u.userId === currentfriend._id) ? <div className="active-user"> Active </div> : <div className="active-user"> Offline </div>
                }
            </div>
            <div className="others">
                <input type="checkbox" id='searchMessage' />
                <input type="checkbox" id='fDetils' />


                <div className="custom-chat">
                    <label htmlFor="fDetils"><h3>Friend Detils </h3></label>
                    <label className='arrowDown' htmlFor="fDetils"><BsChevronDown /></label>
                </div>

                <div className="dropDownFndInfo">

                    <div className="fDetils">
                        <div className="fndDetils">
                            User Name : {currentfriend.userName}
                        </div> <br />
                        <div className="fndDetils">
                            Email : {currentfriend.email}
                        </div> <br />
                        <div className="fndDetils">
                            Registered : {moment(currentfriend.createdAt).startOf('mini').fromNow()}
                        </div>
                    </div>
                </div>
                <div className="privacy">
                    <label htmlFor="searchMessage"><h3>Search Message </h3></label>
                    <label className='arrowDown' htmlFor="searchMessage"><BsChevronDown /></label>
                </div>
                <div className="searchMessage">
                    <div className="search">
                        <button><BiSearch /></button>
                        <input onChange={search} type="text" placeholder='search' className="form-control" />
                    </div>
                </div>
                <div className="media">
                    <label htmlFor="gallery"><h3>Shared Media </h3></label>
                    <label className='arrowDown' htmlFor="gallery"><BsChevronDown /></label>
                </div>
            </div>
            <div className="conversationImage">
                <div className="gallery">
                    {
                        message && message.length > 0 ? message.map((m, index) => m.message.image && <img key={index} src={m.message.image} alt='' />) : ''
                    }
                </div>
            </div>
        </div>
    )
}

export default FriendInfo