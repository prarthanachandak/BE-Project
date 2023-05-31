const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    domain:{
        type: String,
        required: true
    },
    level:{
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: false
    }
})
const Room = mongoose.model('room', roomSchema);
module.exports = Room;