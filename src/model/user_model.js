const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const user_schema = new mongoose.Schema({
    fullname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    cpassword : {
        type : String,
        required : true
    },
    tokens : [
        {
            token : {
                type : String,
                required : true
            }
        }
    ]
});

user_schema.pre('save', async function(next){
    if (this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
});

user_schema.methods.generateAuthToken = async function(){
    try{
        let my_token = jwt.sign({_id: this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token : my_token });
        await this.save();
        return my_token;
    } catch (err) {
        console.log(err)
    }
}

const User = new mongoose.model('USER', user_schema);

module.exports = User;