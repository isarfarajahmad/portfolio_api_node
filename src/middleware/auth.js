const jwt = require('jsonwebtoken');
const Register = require('../model/user_model');

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwtoken;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);

        const user = await Register.findOne({_id:verifyUser._id});
        console.log(user);

        next();

    } catch (err) {
        res.status(401).send(err);
    }
}
module.exports = auth;  