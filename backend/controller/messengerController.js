const User = require('../models/authModel');
const formidable = require('formidable');
const messageModel = require('../models/messageModel');
const cloudinary = require('cloudinary').v2;
const getLastMessage = async (myId, fdId) => {
    const msg = await messageModel.findOne({
        $or: [{
            $and: [{
                senderId: {
                    $eq: myId
                }
            }, {
                reseverId: {
                    $eq: fdId
                }
            }]
        },
        {
            $and: [{
                senderId: {
                    $eq: fdId
                }
            }, {
                reseverId: {
                    $eq: myId
                }
            }]
        }
        ]
    }).sort({
        updatedAt: -1
    });

    return msg;
}
module.exports.getFriends = async (req, res) => {
    const myId = req.myId;
    let fnd_msg = [];
    try {
        const friendGet = await User.find({
            _id: {
                $ne: myId
            }
        });
        for (let i = 0; i < friendGet.length; i++) {
            let lmsg = await getLastMessage(myId, friendGet[i].id);
            fnd_msg = [...fnd_msg, {
                fndInfo: friendGet[i],
                msgInfo: lmsg
            }]
        }
        res.status(200).json({
            success: true,
            friends: fnd_msg
        });
    } catch (error) {
        res.status(500).json({
            error: {
                errorMessage: 'Internal server error'
            }
        })
    }
}

module.exports.messageUplodaDB = async (req, res) => {
    const {
        senderName,
        reseverId,
        message
    } = req.body;
    const senderId = req.myId;
    try {
        const insertMessage = await messageModel.create({
            senderId: senderId,
            senderName: senderName,
            reseverId: reseverId,
            message: {
                text: message,
                image: ''
            }
        })
        res.status(201).json({
            success: true,
            message: insertMessage
        })
    } catch (error) {
        res.status(500).json({
            error: {
                errorMessage: 'Internal server error'
            }
        })
    }
}

module.exports.messageGet = async (req, res) => {

    const myId = req.myId;
    const fdId = req.params.id

    try {
        let getAllMessage = await messageModel.find({
            $or: [{
                $and: [{
                    senderId: {
                        $eq: myId
                    }
                }, {
                    reseverId: {
                        $eq: fdId
                    }
                }]
            },
            {
                $and: [{
                    senderId: {
                        $eq: fdId
                    }
                }, {
                    reseverId: {
                        $eq: myId
                    }
                }]
            }
            ]
        });

        // getAllMessage = getAllMessage.filter(m=>m.senderId === myId && m.reseverId === fdId || m.reseverId === myId && m.senderId === fdId);

        res.status(200).json({
            success: true,
            message: getAllMessage
        });
    } catch (error) {
        res.status(500).json({
            error: {
                errorMessage: 'Internal server error'
            }
        })
    }
}

module.exports.ImageMessageSend = (req, res) => {

    const senderId = req.myId;
    const form = formidable();

    form.parse(req, async(err, fields, files) => {

        const {
            senderName,
            reseverId
        } = fields;

        if (Object.keys(files).length === 0) {
            res.status(400).json({
                error: {
                    errorMessage: 'Please Provide Image'
                }
            })
        }
        if (Object.keys(files).length !== 0) {
            const {  size, type } = files.image;
            const imageSize = (size/1000)/1000;
            const imageType = type.split('/')[1];
            if (imageType !== 'png' && imageType !== 'jpg' && imageType !== 'jpeg') {
                res.status(500).json({
                    error: {
                        errorMessage: 'Internal server error'
                    }
                })
            }
            else if (imageSize > 8) {
                res.status(500).json({
                    error: {
                        errorMessage: 'please provide user image less then 8 MB'
                    }
                })
            }
            else{
                cloudinary.config({
                    cloud_name: process.env.cloud_name,
                    api_key: process.env.api_key,
                    api_secret: process.env.api_secret,
                    secure: true
                });
                try {
                    const result = await cloudinary.uploader.upload(files.image.path);
                    const insertMessage = await messageModel.create({
                        senderId: senderId,
                        senderName: senderName,
                        reseverId: reseverId,
                        message: {
                            text: '',
                            image: result.url
                        }
                    })
                    res.status(201).json({
                        success: true,
                        message: insertMessage
                    })
                } catch (error) {
                    
                }
            }
    
        }
    })
}

module.exports.messageSeen = async (req, res) => {

    const messageId = req.body._id;

    await messageModel.findByIdAndUpdate(messageId, {
        status: 'seen'
    })
        .then(() => {
            res.status(200).json({
                success: true
            })
        }).catch(() => {
            res.status(500).json({
                error: {
                    errorMessage: 'Internal server error'
                }
            })
        })
}

module.exports.delivaredMessage = async (req, res) => {

    const messageId = req.body._id;

    await messageModel.findByIdAndUpdate(messageId, {
        status: 'delivared'
    })
        .then(() => {
            res.status(200).json({
                success: true
            })
        }).catch(() => {
            res.status(500).json({
                error: {
                    errorMessage: 'Internal server error'
                }
            })
        })
}