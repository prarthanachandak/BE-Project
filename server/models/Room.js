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
        type: String,
        required: false
    }
})
const Room = mongoose.model('room', roomSchema);
module.exports = Room;