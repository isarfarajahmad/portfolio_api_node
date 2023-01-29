const express = require('express');
const cors = require('cors');
require('./conn');

const MyProjects = require('./my_models');

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post('/add_projects', async (req, res) => {
    try {
        const addingProjects = new MyProjects(req.body);
        console.log(req.body);
        const insertProjects = await addingProjects.save();
        res.status(201).send(insertProjects);
    } catch (e) {
        res.status(400).send(e);
    }
})

app.get('/projects', async(req, res) => {
    try {
        const getProjects = await MyProjects.find({});
        res.status(201).send(getProjects);
    } catch (e) {
        res.status(400).send(e);
    }
});


app.get('/project/:id', async(req, res) => {
    try {
        const _id = req.params.id;
        const getProject = await MyProjects.findById(_id);
        res.send(getProject);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.patch('/projects/:id', async(req, res) => {
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

app.delete('/projects/:id', async(req, res) => {
    try {
        const getProject = await MyProjects.findByIdAndDelete(req.params.id);
        res.send(getProject);
    } catch (e) {
        res.status(500).send(e);
        console.log(e);
    }
})

app.listen(port, () => {
    console.log("I am live now !")
})