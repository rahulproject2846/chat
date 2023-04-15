const formidable = require('formidable');
const validator = require('validator');
const registerModel = require('../models/authModel');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

module.exports.userRegister = (req, res) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
        //console.log(files.image);
        const {
            userName,
            email,
            password,
            confirmPassword
        } = fields;
        const { image } = files;
        const error = [];

        if (!userName) {
            error.push('please provide your user name');
        }
        if (!email) {
            error.push('please provide your email');
        }
        if (email && !validator.isEmail(email)) {
            error.push('please provide your valid email');
        }
        if (!password) {
            error.push('please provide your password');
        }
        if (!confirmPassword) {
            error.push('please provide user confirm password');
        }
        if (password && confirmPassword && password !== confirmPassword) {
            error.push('your password and confirm password not same')
        }
        if (password && password.length < 6) {
            error.push('please provide password must be 6 charecter');
        }
        if (Object.keys(files).length === 0) {
            error.push('please provide user image');
        }
        if (Object.keys(files).length !== 0) {
            const {  size, type } = files.image;
            const imageSize = (size/1000)/1000;
            const imageType = type.split('/')[1];
            if (imageType !== 'png' && imageType !== 'jpg' && imageType !== 'jpeg') {
                error.push('please provide user image');
            }
            if (imageSize > 8) {
                error.push('please provide user image less then 8 MB');
            }

        }

        if (error.length > 0) {
            res.status(400).json({
                error: {
                    errorMessage: error
                }
            })
        } else {
            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            });

            try {
                const checkUser = await registerModel.findOne(({ email: email }));
                if (checkUser) {
                    res.status(404).json({ error: { errorMessage: ['Your Email Already exited'] } })
                } else{
                    try {
                        const result = await cloudinary.uploader.upload(files.image.path);
                        const userCreate = await registerModel.create({
                            userName,
                            email,
                            password: await bcrypt.hash(password, 10),
                            image: result.url
                        })
                        const token = jwt.sign({
                            id: userCreate._id,
                            email: userCreate.email,
                            userName: userCreate.userName,
                            image: userCreate.image,
                            registerTime: userCreate.createAt
                        }, process.env.SECRET, {
                            expiresIn: process.env.TOKEN_EXP
                        });

                        const options = {
                            expires: new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000)
                        }

                        res.status(201).cookie('authToken', token, options).json({
                            successMessage: 'Your Register Successfull',
                            token
                        })
                    } catch (error) {
                        res.status(404).json({ error: { errorMessage: ['Image Upload Faild'] } })
                                    
                    }
                }
            } catch (error) {
                res.status(500).json({ error: { errorMessage: ['internal Server Error'] } })
                                    
            }

            
        }
    })
}


module.exports.userLogin = async (req, res) => {

    const error = [];
    const { email, password } = req.body;
    if (!email) {
        error.push('Please provide your email')
    }
    if (!password) {
        error.push('Please provide your password')
    }
    if (email && !validator.isEmail(email)) {
        error.push('Please provide your valid email');
    }
    if (error.length > 0) {
        res.status(400).json({ error: { errorMessage: error } });
    } else {
        try {
            const checkUser = await registerModel.findOne({ email: email }).select('+password');

            if (checkUser) {
                const matchPassword = await bcrypt.compare(password, checkUser.password);
                if (matchPassword) {
                    const token = jwt.sign({
                        id: checkUser._id,
                        email: checkUser.email,
                        userName: checkUser.userName,
                        image: checkUser.image,
                        registerTime: checkUser.createAt
                    }, process.env.SECRET, {
                        expiresIn: process.env.TOKEN_EXP
                    });

                    const options = {
                        expires: new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000)
                    }

                    res.status(200).cookie('authToken', token, options).json({
                        successMessage: 'Your login successfull',
                        token
                    })
                } else {
                    res.status(400).json({
                        error: {
                            errorMessage: ['your password not valid']
                        }
                    });
                }
            } else {
                res.status(400).json({
                    error: {
                        errorMessage: ['your email not found']
                    }
                });
            }

        } catch (error) {
            res.status(500).json({
                error: {
                    errorMessage: ['Internal server error']
                }
            });
        }
    }

}


module.exports.userLogout = (req, res) => {
    res.status(200).cookie('authToken', '').json({
        success: true
    })
}