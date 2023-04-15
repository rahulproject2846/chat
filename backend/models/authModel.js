const {model, Schema} = require('mongoose');

const registerSchema = new  Schema({
    userName:{
        type: String,
        require : true
    },
    email:{
        type: String,
        require : true
    },
    password:{
        type: String,
        require : true
    },
    image:{
        type: String,
        require : true
    }

},{timestamps: true});

module.exports = model ('user', registerSchema);