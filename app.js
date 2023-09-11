const mongoose = require("mongoose");
const express = require("express");
const http = require("http");
require("dotenv").config();
const morgan = require('morgan');
const socket = require("socket.io");
const usre = require("./src/routes/user.route");
const auth = require("./src/routes/auth.route");
const chat = require('./src/routes/chat.route');
const notfee = require("./src/routes/notfiy.route")


const { ExpressPeerServer } = require('peer');
const app = express();
const server = http.createServer(app);

app.use(express.json())
app.use(morgan("tiny"));
app.get("/",(q,r)=>{ r.sendFile(__dirname + '/html.html') })

const io = socket(server);

 let online = [];


// const customGenerationFunction = () => (Math.random().toString(36) + '0000000000000000000').substr(2, 16);
//   const peerServer = ExpressPeerServer(server, {
//     debug: true,
//     path: '/',
//     generateClientId:customGenerationFunction,
//   });
//   app.use("/myPeer",peerServer);
const URL_DB = 'mongodb://localhost:27017/chaty';
const URL_DB_ONLINE = 'mongodb+srv://sendme:FOCKqqZxfKW3geLz@cluster0.g5pjneg.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(URL_DB_ONLINE).then(()=>{
    console.log("mongooDB is connected ...");
}).catch((err)=>{
    console.log(err,"mongooDB is not connected ! ");
});



io.on('connection', (socket) => {

    const userID = socket.handshake.query.userId;
    const isFind = online.includes(userID);
    if (!isFind){
        online.push(userID)
        io.sockets.emit("onlineUsers",online)
    }
    require("./src/sockets/join.socket").joinTochatAndJoinToNotification(socket)
    require("./src/sockets/chat.socket").sendAndReciveMessagesandNotification(socket,online)
    console.log("online users : ",online);
    socket.on('disconnect', (data) => {
        const filterOnline = online.filter((item)=> item != userID);
        online = filterOnline;
        console.log("disconnect => online users : ",online);
        io.sockets.emit("onlineUsers",online)
      });
  });

  
//  





// connected in mongo db -####################################



// use routers -####################################
app.use('/auth',auth);
app.use('/persons',usre);
app.use("/chat",chat)
app.use("/notfee",notfee)
// app.use('/chat',(req,_,next)=> {req.io = io;next()} ,chat);


//ERROR Handler
app.use((err, req, res, next) => {
    if (err) {
        console.log(err,"dddddddddd");
         res.status(err.status || 409).json(err);
    }
});





server.listen(5001,()=>{
    console.log("back work on 5001 ...");
})


