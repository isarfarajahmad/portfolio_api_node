const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Connecting Database
require('../db/conn');

// Using Projects Model
const MyProjects = require('../model/my_models');
const User = require('../model/user_model');

router.get("/", (req, res) => {
    res.send("Hello World from Router");
});

const middleware = (req, res, next) => {
    console.log("Middleware is available ... ");
    next();
}

router.get('/login', (req, res) => {
    res.send("Login Page");
})

// router.post('/register', (req, res) => {
//     const { fullname, email, phone, password, cpassword} = req.body;

//     if(!fullname || !email || !phone || !password || !cpassword) {
//         return res.status(422).json({error: "Please fill all the required details !"})
//     }

//     User.findOne({email : email})
//     .then((userExist) => {
//             if (userExist) {
//                 return res.status(422).json({error: "User already exist !"})
//             }
//                 const user = new User({fullname, email, phone, password, cpassword});

//                 user.save().then(() => {
//                     res.status(201).json({message: "User Successfully Registered !"})
//                 }).catch((err) => {
//                     res.status(500).json({error: "User Registration Failed !"})
//                 })
//         }).catch((err) => {console.log(err);});
// })

router.post('/register', async (req, res) => {
    const { fullname, email, phone, password, cpassword} = req.body;

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

router.post('/add_projects', async (req, res) => {
    try {
        const addingProjects = new MyProjects(req.body);
        console.log(req.body);
        const insertProjects = await addingProjects.save();
        res.status(201).send(insertProjects);
    } catch (e) {
        res.status(400).send(e);
    }
})

router.get('/projects', middleware, async(req, res) => {
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

router.patch('/projects/:id', async(req, res) => {
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

router.delete('/projects/:id', async(req, res) => {
    try {
        const getProject = await MyProjects.findByIdAndDelete(req.params.id);
        res.send(getProject);
    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }
})


module.exports = router;