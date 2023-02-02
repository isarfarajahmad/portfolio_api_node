// const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;

// Connecting Database
require('../db/conn');
// dotenv.config({ path: '../config.env'});

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true
  });

// Using Projects Model
const MyProjects = require('../model/project_model');
const User = require('../model/user_model');
const auth = require('../middleware/auth');

router.post('/add_projects', auth, (req, res) => {
    try {
        const file = req.files.thumbnail;
        cloudinary.uploader.upload(file.tempFilePath, {folder: 'portfolio'}, async (err, result) =>{
            console.log("Image Uploaded Successfully");
            const addingProjects = new MyProjects({
                headline:req.body.headline,
                subheadline:req.body.subheadline,
                thumbnail:result.url,
                description:req.body.description,
                active:req.body.active,
                featured:req.body.featured,
            });
            const insertProjects = await addingProjects.save();
            res.status(201).send(insertProjects);
        });
        
    } catch (e) {
        res.status(400).send(e);
    }
})


router.get('/secret', auth, (req, res) => {
    // console.log(`We have got the cookie ${req.cookies.jwtoken}`);
    res.send("secret")
})
router.get('/', (req, res) => {
    res.send("This is just a homepage")
})

router.get('/logout_all', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        res.clearCookie('jwtoken')
        await req.user.save();
        res.send({message: "You are logged out !"})
    } catch (err) {
        res.status(500).send(err);
    }
})

router.get('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((current_token) => {
            return current_token.token != req.token;
        })
        res.clearCookie('jwtoken')
        await req.user.save();
        res.send({message: "You are logged out !"})
    } catch (err) {
        res.status(500).send(err);
    }
})

router.post('/register', async (req, res) => {
    const { fullname, email, password, cpassword} = req.body;

    if(!fullname || !email || !password || !cpassword) {
        return res.status(422).json({error: "Please fill all the required details !"})
    }

    if(password != cpassword){
        return res.status(422).json({error: "Password not matching !"});
    }

    try{
        const emailExist = await User.findOne({email : email});
        if(emailExist){
            res.status(422).json({error: "Email already exist !"});
        } else {
            const user = new User({fullname, email, password, cpassword});

            await user.save();

            res.status(201).json({message: "User Registered Successfully !"})
        }
    } catch (err) {
        console.log(err);
    }
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({error: "Please fill all the required details !"});
    }
    try{
        const userLogin = await User.findOne({email : email});

        if (userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password);

            const token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie('jwtoken', token, {
                expires : new Date(Date.now()+25892000000),
                httpOnly : true
            });

            if (!isMatch){
                res.status(422).json({error : "Invalid Credentials !"})
            } else {
                res.status(201).json({message : "Login Successfull !"})
            }
        } else {
            res.status(422).json({error : "Invalid Credentials !"})
        }
    } catch (err) {
        console.log(err);
    }
})


router.get('/projects', async(req, res) => {
    try {
        const getProjects = await MyProjects.find({});
        res.cookie('token', 'sarfaraj');
        res.status(201).send(getProjects);
    } catch (e) {
        res.status(400).send(e);
    }
});


router.get('/project/:id', async(req, res) => {
    try {
        const _id = req.params.id;
        const getProject = await MyProjects.findById(_id);
        res.send(getProject);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.patch('/projects/:id', auth, async(req, res) => {
    try {
        const _id = req.params.id;
        const updateProject = await MyProjects.findByIdAndUpdate(_id, req.body, {
            new : true
        });
        res.send(updateProject);
    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }
});

router.delete('/projects/:id', auth, async(req, res) => {
    try {
        const getProject = await MyProjects.findByIdAndDelete(req.params.id);
        res.send(getProject);
    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }
})


module.exports = router;