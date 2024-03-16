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
const admin = require("firebase-admin");

const { ExpressPeerServer } = require('peer');
const app = express();
const server = http.createServer(app);

app.use(express.json())
app.use(morgan("tiny"));

app.get("/",(q,r)=>{ r.sendFile(__dirname + '/html.html') })

const io = socket(server);

 let online = [];

const URL_DB = 'mongodb://localhost:27017/chaty';
const URL_DB_ONLINE = 'mongodb+srv://sendme:FOCKqqZxfKW3geLz@cluster0.g5pjneg.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(URL_DB_ONLINE).then(()=>{
    console.log("mongooDB is connected ...");
}).catch((err)=>{
    console.log(err,"mongooDB is not connected ! ");
});



var serviceAccount = require("./adminFirebaseSDK.json");
const { User } = require("./src/models/user.model");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
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
      socket.on("getOnlineUsers",()=>{
        io.sockets.emit("onlineUsers",online)
      })

      socket.on("sendNotifyNewMessage", async (data,callback)=>{

        const sender = JSON.parse(data[1]?.sender)
        const userToken = await User.findById(data[0])

        if (userToken) {
            callback({
              isSent:true
            });
            const isReciverOnline = online.find(ele => ele == userToken?._id);
            console.log( " < this is Reciver its onLine : ",!!isReciverOnline);
            if (!!isReciverOnline) {
                 socket.to(data[0]).emit("reciveNotifyNewMessage",data[1])
                 socket.to(data[0]).emit("reciveNewMessage",data[1])
             } else {
                console.log("|".repeat(50),!(online?.includes(userToken._id)) && userToken?.FCMtoken != "","|".repeat(50));
                await User.findByIdAndUpdate(data[0],{
                  $push:{
                    unReadMessages:{
                      id: data[1]?.id,
                      chat : data[1]?.chat,
                      content : data[1]?.content ,
                      sender : data[1]?.sender ,
                      timestamp: data[1]?.timestamp ,
                      isRead: '0',
                   }
                  }
                })
                if ((userToken?.FCMtoken != "") ) {
                    // console.log("can send notification from firebase : TRUE");
                    // await admin.messaging().send({
                    //   token: userToken?.FCMtoken,
                    //   android:{
                    //     notification:{
                    //     channelId:data[1]?.chat,
                    //     },
                    //   },
                    //   notification: {
                    //   title: `${sender.username}`,
                    //   body: `${data[1]?.content}`,
                    //   },
                    //   data: {
                    //       notifee: JSON.stringify({
                    //           body: data[1]?.content,
                    //           android: {
                    //             channelId: data[1]?.chat,
                    //             actions: [
                    //               {
                    //                 title: 'Mark as Read',
                    //                 pressAction: {
                    //                   id: 'read',
                    //                 },
                    //               },
                    //             ],
                    //           },
                    //         }),
                    //       },
                      
                    // }).then(()=>{
                    //     console.log("send message succesfuly to this token : ",userToken?.FCMtoken);
                    // }).catch((err)=>{
                    //   console.log(err.message);
                    // })
                }
                
            }
            callback({
              isSent:true
            });
        }
        callback({
          isSent:false
        });
     

       });

      //  socket.on("sendNewMessage", async (data,callback)=>{

      //   const sender = JSON.parse(data[1]?.sender)
      //   const userToken = await User.findById(data[0])

      //   if (userToken) {
      //       callback({
      //         isSent:true
      //       });
      //       const isReciverOnline = online.find(ele => ele == userToken?._id);
      //       console.log( " < this is Reciver its onLine : ",!!isReciverOnline);
      //       if (!!isReciverOnline) {
      //            socket.to(data[0]).emit("reciveNotifyNewMessage",data[1])
      //        } else {
      //           console.log("|".repeat(50),!(online?.includes(userToken._id)) && userToken?.FCMtoken != "","|".repeat(50));
      //           await User.findByIdAndUpdate(data[0],{
      //             $push:{
      //               unReadMessages:{
      //                 id: data[1]?.id,
      //                 chat : data[1]?.chat,
      //                 content : data[1]?.content ,
      //                 sender : data[1]?.sender ,
      //                 timestamp: data[1]?.timestamp ,
      //                 isRead: '0',
      //              }
      //             }
      //           })
      //           if ((userToken?.FCMtoken != "") ) {
      //               console.log("can send notification from firebase : TRUE");
      //               await admin.messaging().send({
      //                 token: userToken?.FCMtoken,
      //                 android:{
      //                   notification:{
      //                   channelId:data[1]?.chat,
      //                   },
      //                 },
      //                 notification: {
      //                 title: `${sender.username}`,
      //                 body: `${data[1]?.content}`,
      //                 },
      //                 data: {
      //                     notifee: JSON.stringify({
      //                         body: data[1]?.content,
      //                         android: {
      //                           channelId: data[1]?.chat,
      //                           actions: [
      //                             {
      //                               title: 'Mark as Read',
      //                               pressAction: {
      //                                 id: 'read',
      //                               },
      //                             },
      //                           ],
      //                         },
      //                       }),
      //                     },
                      
      //               }).then(()=>{
      //                   console.log("send message succesfuly to this token : ",userToken?.FCMtoken);
      //               }).catch((err)=>{
      //                 console.log(err.message);
      //               })
      //           }
                
      //        }
      //       callback({
      //         isSent:true
      //       });
      //   }
      //   callback({
      //     isSent:false
      //   });
     

      //  });

       socket.on("sendChangeMessageStatus", async (data,callback)=>{
        const {status,messagesIds,toId,} = data;
        if (messagesIds.length != 0) { 
  
          const isReciverOnline = online.find(ele => ele == toId);
  
          if (!!isReciverOnline) {
            console.log("send status to : ",isReciverOnline);
            console.log("send reciveChangeMessageStatus to USER ");
              socket.to(toId).emit("reciveChangeMessageStatus",{status,messagesIds});
  
          } else {
            console.log("send reciveChangeMessageStatus to DATABASE ");
            const userToken = await User.findById(toId);
              if (userToken) {
                await User.findByIdAndUpdate(toId,{
                  $push:{
                    messagesStatus:{
                      messagesIds: messagesIds,
                      status:status
                  }
                  }
                })
               
              };
  
          }
  
          callback({
            isSent:true
          });
  
        }
        callback({
          isSent:false
        }); 
      });

      socket.on("delMessages", async (data,callback)=>{

        console.log("MessagesRemoved : ",data);

        const {messagesIds,toId} = data;
        if (messagesIds.length != 0) { 

          const isReciverOnline = online.find(ele => ele == toId);
  
          if (!!isReciverOnline) {
              socket.to(toId).emit("reciveMessagesDeleted",messagesIds);
              callback({
                isSent:true
              });
          } else {
            const userToken = await User.findById(toId);
              if (userToken) {
                userToken.messagesDeleted.concat(messagesIds);
                userToken.messagesDeleted =  userToken.messagesDeleted.filter((ele)=> !messagesIds.includes(ele.id) )
                await userToken.save()
                callback({
                  isSent:true
                });
               
              };
  
          }
  
        }
        callback({
          isSent:false
        }); 
      })

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
         res.status(err.status || 444).json(err);
    }
});




const port = process.env.PORT || 5001
server.listen(port,()=>{
    console.log("back work on 5001 ...");
})


