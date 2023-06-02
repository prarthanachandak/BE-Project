const cors=require("cors");
const corsOptions ={
   origin:'http://127.0.0.1:3000',
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const ytdl = require('ytdl-core');
const authRoutes = require('./routes/authRoutes');
app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());
app.use(authRoutes);
const http = require('http').createServer(app);
const mongoose = require('mongoose');
const socketio = require('socket.io')
const io = socketio(http);
const mongoDB = "";
mongoose.connect(mongoDB,).then(() => console.log('database connected')).catch(err => console.log(err))
const { addUser, getUser, removeUser } = require('./helper');
const Message = require('./models/Message');
const PORT = process.env.PORT || 5000;
const Room = require('./models/Room');
const axios=require('axios');
app.get('/set-cookies', (req, res) => {
    res.cookie('username', 'Tony');
    res.cookie('isAuthenticated', true, { maxAge: 24 * 60 * 60 * 1000 });
    res.send('cookies are set');
})
app.get('/get-cookies', (req, res) => {
    const cookies = req.cookies;
    res.json(cookies);
})
// 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
io.on('connection', (socket) => {
    Room.find().then(result => {
        socket.emit('output-rooms', result)
    })
    socket.on('create-room', (roomName,link, age, domain) => {
        const room = new Room({ 
            name:roomName,
            link:link,
            age: age,
            domain: domain,
            level: "College",
        });
        room.save().then(result => {
            io.emit('room-created', result)
        })
        dataobj = {
            "domain": domain,
            "age": age,
            "reputation" : 4,
            "Recommended chat rooms": roomName
        }
        axios.post('http://127.0.0.1:8000/create_room', dataobj)
            .then(response=>{
            })
            .catch(error => {
                console.error(error);
              });  

    })

    socket.on('rec-room', (domain, age, rating) =>{
        dataobj = {
            "domain": domain,
            "age": age,
            "reputation" : rating
        }
        axios.post('http://127.0.0.1:8000/process_data', dataobj)
            .then(response=>{
                const recommendedRooms = response.data;
                console.log("Rec", recommendedRooms);
                try {
                    recommendedRoomsArr = JSON.parse(recommendedRooms);
                } catch (error) {
                    console.error("Error occurred while parsing recommendedRooms:", error);
                    return;
                 }
                Room.find({ $or: recommendedRoomsArr.map(room => ({ name: room[0], domain: room[1], age: room[2], rating: room[3] })) })
                .then(result => {
                    console.log("Found rooms:", result);
                    socket.emit('rec-rooms', result)
                })
                .catch(err => {
                    console.error("Error occurred while searching for rooms:", err);
                });                  
            })
            .catch(error => {
                console.error(error);
              });            
    })

    socket.on('sendRecommends', (room_id) =>{
        
        Room.findById(room_id)
        .then(room => {
            if (room) {
                if(room.rating && room.domain && room.age){
                    const domain = room.domain;
                    const age = room.age;
                    const rating = room.rating;
                    dataobj = {
                        "domain": domain,
                        "age": age,
                        "reputation" : rating
                    }
                    console.log(dataobj)
                    axios.post('http://127.0.0.1:8000/process_data', dataobj)
                    .then(response=>{
                        const recommendedRooms = response.data;
                        console.log("Rec", recommendedRooms);
                        
                        const roomsJson = recommendedRooms.map(room => ({
                            "name": room[0],
                            "age": room[2],
                            "domain": room[1],
                            "rating": room[3]
                          }));
                        // socket.emit('rec-similar-rooms', recommendedRooms)

                    })
                    .catch(error => {
                        console.error(error);
                        // Handle any error that occurred during the request
                    });
                    // Room.find(
                    //     {"domain": domain,
                    //     "age": { $gt: 20 }
                    //     }).then(result => {
                    //     socket.emit('rec-similar-rooms', result)
                    // })
                }
            } else {
            throw new Error("Room not found");
            }
        })
        // console.log(dataobj);
            //   Room.find(
            //         {"domain": domain,
            //         "age": { $gt: 20 }
            //         }).then(result => {
            //             console.log(result)
            //     })
    })

    socket.on('update-rating', async (room_id, newRating) =>{
        Room.findById(room_id)
        .then(room => {
            if (room) {
                if(room.rating){
                    const currentRating = room.rating;
                    const updatedRating = (currentRating + newRating) / 2;
                    room.rating = updatedRating;
                }
                else{
                    room.rating = newRating;
                }
                return room.save();
            
            } else {
            throw new Error("Room not found");
            }
        })
    })      

    socket.on('join', ({ name, room_id, user_id }) => {
        const { error, user } = addUser({
            socket_id: socket.id,
            name,
            room_id,
            user_id
        })
        socket.join(room_id);
        if (error) {
            console.log('join error', error);
        } else {
            // console.log('join user', user);
        }
    })
    socket.on('sendMessage', (message, room_id, callback) => {
        const user = getUser(socket.id);
        const msgToStore = {
            name: user.name,
            user_id: user.user_id,
            room_id,
            text: message
        }
        const msg = new Message(msgToStore);
        msg.save().then(result => {
            io.to(room_id).emit('message', result);
            callback()
        })
    })
    socket.on('sendVideoUrl', (videoUrl,room_id,callback) => {
        Room.findByIdAndUpdate(room_id,{link:videoUrl},(err,docs)=>{
            if(err){
                console.log(err);
            }else{
                io.to(room_id).emit('display-video',videoUrl);
                callback();
            }
        })
    })
    socket.on('sendPdfUrl', (pdfUrl,room_id,callback) => {
        Room.findByIdAndUpdate(room_id,{pdflink:pdfUrl},(err,docs)=>{
            if(err){
                console.log(err);
            }else{
                io.to(room_id).emit('display-pdf',pdfUrl);
                callback();
            }
        })
    })
    socket.on('get-videoUrl', room_id => {
        Room.find({"_id":room_id}).then(result=>{
            result=ytdl.getURLVideoID(result[0].link);
            socket.emit('display-video',result);
        });
    })
    socket.on('get-messages-history', room_id => {
        Message.find({ room_id }).then(result => {
            socket.emit('output-messages', result)
        });
    })
    socket.on('get-room-name', room_id =>{
        Room.find({"_id":room_id}).then(result =>{
            result = result[0].name;
            socket.emit("display-name",result);
        })
    })
    socket.on('get-room-rating', room_id =>{
        Room.find({"_id":room_id}).then(result =>{
            result = result[0].rating;
            socket.emit("display-rating",result);
        })
    })
    socket.on('get-room-age', room_id =>{
        Room.find({"_id":room_id}).then(result =>{
            result = result[0].age;
            socket.emit("display-age",result);
        })
    })
    socket.on('get-room-domain', room_id =>{
        Room.find({"_id":room_id}).then(result =>{
            result = result[0].domain;
            socket.emit("display-domain",result);
        })
    })
    // socket.on('rec-room', (domain, age) => {
    //     if(age>0 && age<10){
    //         Room.find(
    //             {"domain": domain,
    //              "age": { $gt: 0, $lt: 11 }
    //             }).then(result => {
    //             console.log("R", result);
    //             socket.emit('rec-rooms', result)
    //         })
    //     }
    //     else if(age>=10 && age<=20){
    //         Room.find(
    //             {"domain": domain,
    //              "age": { $gt: 9, $lt: 20 }
    //             }).then(result => {
    //             console.log("R", result);
    //             socket.emit('rec-rooms', result)
    //         })
    //     }
    //     else if(age>20 && age<=25){
    //         Room.find(
    //             {"domain": domain,
    //              "age": { $gt: 20, $lt: 26 }
    //             }).then(result => {
    //             console.log("R", result);
    //             socket.emit('rec-rooms', result)
    //         })
    //     }
    //     else{
    //         Room.find(
    //             {"domain": domain,
    //              "age": { $gt: 20 }
    //             }).then(result => {
    //             console.log("R", result);
    //             socket.emit('rec-rooms', result)
    //         })
    //     }
    // })
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
    })

});

http.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
