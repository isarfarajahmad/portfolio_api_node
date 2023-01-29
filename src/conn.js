const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/portfolio').then(() => {
    console.log('Connection Success !');
}).catch((e) => {
    console.log('No Connection !');
})