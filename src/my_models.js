const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    "headline" : {
        type: String,
        required: true,
        trim: true
    },
    "subheadline" : {
        type: String,
        required: true,
        trim: true
    },
    "description" : {
        type : String,
        required : true,
        trim : true
    },
    "active" : {
        type : Boolean,
    },
    "featured" : {
        type : Boolean,
    },
});
const My_Projects = new mongoose.model('My_Projects', projectSchema);

module.exports = My_Projects;