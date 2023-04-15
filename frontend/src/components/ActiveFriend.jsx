import React from 'react'

const ActiveFriend = ({ user, setCurrentFriend }) => {
    return (
        <div>
            <div onClick={() => setCurrentFriend({
                _id: user.userInfo.id,
                email: user.userInfo.email,
                image: user.userInfo.image,
                userName: user.userInfo.userName
            })} className="active-friend">
                <label htmlFor="friendCheckbox">
                    <div className="image-active-icon">

                        <div className="image">
                            <img src={user.userInfo.image} alt="" />
                            <div className="active-icon"></div>
                        </div>

                    </div><p>{user.userInfo.userName}</p></label>
            </div>
        </div>
    )
}

export default ActiveFriend